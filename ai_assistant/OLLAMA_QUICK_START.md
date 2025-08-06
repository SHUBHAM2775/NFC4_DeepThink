# 🦙 Quick Ollama Setup Guide

## Step 1: Install Ollama
1. Visit https://ollama.ai/ in your browser
2. Click "Download for Windows"
3. Run the installer (OllamaSetup.exe)
4. Ollama will start automatically after installation

## Step 2: Download a Model
Open a new terminal/command prompt and run:
```bash
ollama pull llama3.2
```

This downloads a 3B parameter model (~2GB) that's perfect for pregnancy assistance.

## Step 3: Verify Installation  
```bash
ollama list
```
You should see llama3.2 in the list.

## Step 4: Test Your Complete Setup
```bash
python test_memory_multilingual.py
```
Expected output: "Local AI initialized with provider: ollama" + multilingual support active!

## Step 5: Start Your Pregnancy Assistant
```bash
python app.py
```

## 🎉 You're Done!
Your pregnancy assistant now has:
- ✅ **Intelligent AI responses** (Ollama-powered)
- ✅ **Memory of your pregnancy journey**
- ✅ **Multilingual support** (10+ languages)
- ✅ **Complete privacy** (everything runs locally)

## Test with Different Languages

**English:**
```json
{
  "user_id": "test",
  "week": 20,
  "daily_log": {"mood": "excited", "concerns": ["first kicks!"]}
}
```

**Hindi:**
```json
{
  "user_id": "test", 
  "language": "hindi",
  "week": 20,
  "daily_log": {"mood": "खुश", "concerns": ["पहली बार लात महसूस हुई!"]}
}
```

## Alternative Models (Optional)
If you have more RAM, try these for even better responses:
- `ollama pull mistral` - 7B model with excellent reasoning (8GB+ RAM)
- `ollama pull llama3.1` - Latest 8B Meta model (8GB+ RAM)

Your assistant will automatically use whatever model you have available!
