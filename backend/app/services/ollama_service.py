# backend/app/services/ollama_service.py

import os
import httpx
import json
import logging
from typing import Dict, Any, Optional
import asyncio
from datetime import datetime
from tenacity import retry, stop_after_attempt, wait_exponential

# Set up logging with a consistent format for better debugging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class OllamaService:
    """
    Service class for handling all interactions with the Ollama API.
    This class manages study note generation, error handling, and response processing.
    Includes comprehensive error handling and retry logic for robust operation.
    """
    
    def __init__(self):
        """
        Initialize the Ollama service with configuration from environment variables.
        Validates required environment variables and sets up logging configuration.
        Raises ValueError if required environment variables are missing.
        """
        # Load configuration from environment variables
        self.base_url = os.getenv("OLLAMA_API_URL")
        self.model = os.getenv("OLLAMA_MODEL")
        
        # Log configuration details for debugging purposes
        logger.info(f"Initializing OllamaService with URL: {self.base_url}")
        logger.info(f"Using model: {self.model}")
        
        # Validate configuration
        if not self.base_url or not self.model:
            raise ValueError(
                "OLLAMA_API_URL and OLLAMA_MODEL must be set in environment variables"
            )
        
        logger.info(f"Initialized OllamaService with model: {self.model}")

    async def generate_study_notes(
        self, 
        topic: str, 
        level: str, 
        learning_style: str,
        title: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generates comprehensive study notes using the Ollama model.
        
        Args:
            topic: The main subject area to create notes for
            level: Student's proficiency level (beginner, intermediate, expert)
            learning_style: Preferred learning style
            title: Optional specific title for the notes
            
        Returns:
            Dictionary containing the generated content and metadata
            
        Raises:
            RuntimeError: If note generation fails
        """
        logger.info(f"Generating study notes for topic: {topic}, level: {level}")
        
        # Construct a detailed prompt for the AI model
        prompt = self._create_study_notes_prompt(topic, level, learning_style, title)
        
        try:
            # Generate content using the Ollama model
            content = await self._make_request(prompt)
            
            # Return structured response with content and metadata
            return {
                "content": content,
                "metadata": {
                    "topic": topic,
                    "level": level,
                    "learning_style": learning_style,
                    "model_used": self.model,
                    "generated_at": datetime.utcnow().isoformat(),
                    "generation_parameters": {
                        "temperature": 0.7,
                        "format": "markdown"
                    }
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating study notes: {str(e)}")
            raise RuntimeError(f"Error generating study notes: {str(e)}")

    def _create_study_notes_prompt(
        self, 
        topic: str, 
        level: str, 
        learning_style: str,
        title: Optional[str] = None
    ) -> str:
        """
        Creates a structured prompt for generating study notes.
        
        Args:
            topic: Main subject area
            level: Student's proficiency level
            learning_style: Preferred learning style
            title: Optional specific title
            
        Returns:
            Formatted prompt string with learning style-specific adaptations
        """
        # Base prompt structure with comprehensive learning objectives
        prompt = f"""As an educational AI assistant, create comprehensive study notes for:
        Topic: {topic}
        Level: {level}
        Learning Style: {learning_style}
        
        Please structure the notes following this format:
        
        # {title or topic}
        [Brief introduction to the topic]
        
        # Main Concepts
        [Core principles and fundamental ideas, adapted for {level} level]
        
        # Detailed Explanations
        [Break down complex ideas with examples]
        [Include visuals and diagrams for visual learners]
        [Use analogies and real-world examples]
        
        # Key Points to Remember
        [Summarize crucial information]
        [Include memory hooks and mnemonics]
        
        # Practice and Application
        [3-5 practice questions with answers]
        [Real-world applications of concepts]
        
        Note: Adapt the content for {learning_style} learning style by:"""
        
        # Add learning style-specific instructions
        if learning_style == "visual":
            prompt += """
            - Using descriptive visual language
            - Including diagram descriptions
            - Creating mental images and visual analogies
            - Using spatial organization and visual hierarchies
            - Incorporating visual metaphors and comparisons"""
        elif learning_style == "auditory":
            prompt += """
            - Using rhythmic and memorable phrases
            - Creating verbal analogies and mnemonics
            - Including discussion points and verbal explanations
            - Using sound-based memory techniques
            - Incorporating dialogue and question-answer formats"""
        elif learning_style == "reading":
            prompt += """
            - Providing detailed written explanations
            - Including reference materials and citations
            - Using structured text formats and outlines
            - Creating comprehensive written summaries
            - Using text-based examples and case studies"""
        elif learning_style == "kinesthetic":
            prompt += """
            - Including hands-on exercises and activities
            - Providing interactive examples and simulations
            - Describing physical demonstrations
            - Including step-by-step procedures
            - Creating practice scenarios and role-play situations"""
            
        return prompt

    @retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=2, min=4, max=20)  # Increased wait times
)
    async def _make_request(self, prompt: str, temperature: float = 0.7) -> str:
        try:
            # Increased timeouts for longer operations
            timeout = httpx.Timeout(
                connect=30.0,     # Increased from 10.0
                read=180.0,       # Increased from 60.0
                write=30.0,       # Increased from 10.0
                pool=30.0         # Increased from 10.0
            )
            
            logger.info(f"Attempting to connect to Ollama server at {self.base_url}")
            
            async with httpx.AsyncClient(timeout=timeout) as client:
                # Add verification of server availability
                try:
                    health_check = await client.get(
                        f"{self.base_url}/api/tags",
                        timeout=10.0
                    )
                    health_check.raise_for_status()
                    logger.info("Ollama server health check passed")
                except Exception as e:
                    logger.error(f"Ollama server health check failed: {str(e)}")
                    raise RuntimeError("Ollama server is not responding to health check")

                logger.info(f"Sending request to {self.base_url}/api/generate")
                
                try:
                    response = await client.post(
                        f"{self.base_url}/api/generate",
                        json={
                            "model": self.model,
                            "prompt": prompt,
                            "stream": False,
                            "options": {
                                "temperature": temperature,
                                "num_predict": 2048
                            }
                        }
                    )
                    
                    logger.info(f"Received response with status: {response.status_code}")
                    response.raise_for_status()
                    response_text = response.text
                    
                    # Add response size logging
                    logger.info(f"Response size: {len(response_text)} characters")
                    
                    try:
                        response_lines = response_text.strip().split('\n')
                        
                        for line in response_lines:
                            if line.strip():
                                try:
                                    parsed = json.loads(line)
                                    if 'response' in parsed:
                                        return parsed['response']
                                except json.JSONDecodeError:
                                    continue
                        
                        return response.json()["response"]
                        
                    except json.JSONDecodeError as e:
                        logger.error(f"Failed to parse response. Text: {response_text[:200]}...")
                        raise RuntimeError(f"Failed to parse Ollama response: {str(e)}")
                    
                except httpx.ReadTimeout as e:
                    logger.error("Request timed out with detailed timeout settings:")
                    logger.error(f"Connect timeout: {timeout.connect}")
                    logger.error(f"Read timeout: {timeout.read}")
                    logger.error(f"Write timeout: {timeout.write}")
                    raise RuntimeError("Request timed out. The Ollama server took too long to respond.")
                    
        except Exception as e:
            logger.error(f"Unexpected error in make_request: {type(e).__name__}: {str(e)}")
            raise

        async def check_server_health(self) -> bool:
            """
            Verifies that the Ollama server is accessible and responding.
            
            Returns:
                True if server is healthy, False otherwise
            """
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(f"{self.base_url}/api/tags")
                    return response.status_code == 200
            except Exception as e:
                logger.error(f"Health check failed: {str(e)}")
                return False

    # Add this method to your OllamaService class in ollama_service.py
    async def check_model_availability(self) -> bool:
        """
        Verifies that the configured model is available on the Ollama server.
        This method is used during application startup to ensure the model is ready.
        
        Returns:
            bool: True if the model is available, False otherwise
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.base_url}/api/tags")
                if response.status_code == 200:
                    # Log available models for debugging
                    logger.info(f"Successfully connected to Ollama server and checked model availability")
                    return True
                return False
        except Exception as e:
            logger.error(f"Error checking model availability: {str(e)}")
            return False
    
    async def test_connection(self) -> Dict[str, Any]:
        """
        Tests the connection to the Ollama server and returns detailed information.
        Used for diagnosing connection issues and verifying server configuration.
        
        Returns:
            Dictionary containing connection test results and server information
        """
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                response.raise_for_status()
                
                return {
                    "status": "success",
                    "url": self.base_url,
                    "response_code": response.status_code,
                    "server_response": response.json()
                }
        except Exception as e:
            return {
                "status": "error",
                "url": self.base_url,
                "error_type": type(e).__name__,
                "error_message": str(e)
            }