# AI Provider Switch Guide

## Overview
MindMate now supports easy switching between Gemini (for testing) and OpenAI (for production) AI providers directly from the Settings page.

## Features

### 🎯 Quick Toggle
- Switch between providers instantly without restarting the server
- Visual indicators show current mode (Testing/Production)
- Real-time provider status display

### 🔄 How to Use

1. **Open Settings Page**
   - Navigate to the Settings page in the frontend
   - Scroll to the "AI Provider" section

2. **Switch Provider**
   - Click on the provider card you want to use:
     - **Gemini** (Blue) - Testing Mode
     - **OpenAI** (Green) - Production Mode
   - The switch happens instantly
   - A success toast will confirm the switch

3. **Check Status**
   - Current provider is displayed at the top
   - Badge shows "TESTING" (Gemini) or "PRODUCTION" (OpenAI)
   - Available providers are automatically detected

## Provider Details

### Gemini (Testing Mode)
- **Model**: Gemini 2.5 Flash (experimental)
- **Use Case**: Testing, development, quick iterations
- **Cost**: Very low (often free tier available)
- **Speed**: Fast
- **Status Badge**: Blue "TESTING"

### OpenAI (Production Mode)
- **Model**: GPT-4o-mini
- **Use Case**: Production, real users, best quality
- **Cost**: Low (~$0.15 per 1M input tokens)
- **Speed**: Fast
- **Status Badge**: Green "PRODUCTION"

## API Endpoints

### Get Current Provider
```http
GET /settings/provider
```

Response:
```json
{
  "current_provider": "gemini",
  "available_providers": ["gemini", "openai"],
  "message": "Current provider: gemini"
}
```

### Switch Provider
```http
POST /settings/provider
Content-Type: application/json

{
  "provider": "openai"
}
```

Response:
```json
{
  "current_provider": "openai",
  "available_providers": ["gemini", "openai"],
  "message": "Switched to OPENAI (Production Mode)"
}
```

## Configuration

### Environment Variable
You can set the default provider in `backend/.env`:
```env
REFLECTION_PROVIDER=gemini  # or "openai"
```

### Runtime Switching
The provider can be changed at runtime via:
1. Frontend Settings page (recommended)
2. API endpoint `/settings/provider`
3. The change takes effect immediately for new journal entries

## Testing Workflow

1. **Development/Testing**
   - Set provider to Gemini
   - Test features and functionality
   - Make changes and iterate quickly
   - Low cost, fast responses

2. **Production**
   - Switch to OpenAI
   - Best quality responses
   - Production-ready performance
   - Still cost-effective

## Notes

- **Immediate Effect**: Provider changes take effect immediately for new journal entries
- **No Restart Required**: Server doesn't need to be restarted
- **Automatic Fallback**: If selected provider is unavailable, system falls back to available provider
- **Both Providers Initialized**: Both Gemini and OpenAI are initialized at startup (if API keys are provided)
- **Provider Status**: Settings page shows which providers are available based on API keys

## Troubleshooting

### No Providers Available
If you see "No AI providers available":
- Check that API keys are set in `backend/.env`
- Verify API keys are valid
- Restart the backend server

### Provider Switch Not Working
- Check browser console for errors
- Verify backend is running
- Check network connection
- Ensure API keys are valid

### Provider Not Switching
- Clear browser cache
- Refresh the page
- Check backend logs for errors
- Verify the API endpoint is accessible

## Best Practices

1. **Use Gemini for Testing**: Fast, free, perfect for development
2. **Use OpenAI for Production**: Best quality for real users
3. **Monitor Costs**: Keep an eye on API usage
4. **Test Both**: Ensure your app works with both providers
5. **Set Defaults**: Configure default provider in `.env` file

---

**Current Status**: ✅ Provider switching is fully functional!
