@echo off
echo Starting AI Assistant Server...
echo.
echo Make sure you have Python installed and the requirements are installed:
echo   pip install -r requirements.txt
echo.
echo For full AI capabilities, make sure Ollama is running:
echo   1. Install Ollama from https://ollama.ai/
echo   2. Run: ollama pull llama3.2
echo   3. Start Ollama service
echo.
cd /d "%~dp0"
python app.py
pause
