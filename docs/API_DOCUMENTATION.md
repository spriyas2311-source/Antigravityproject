# REST API Documentation: Krishi Mitra AI

Base URL: `/api/v1`

All requests except public health check and agricultural sources require the HTTP header:
```text
Authorization: Bearer <supabase_jwt_access_token>
```

---

## 1. Authentication & Farmer Profile

### `GET /api/v1/profile`
Retrieves the logged-in farmer's profile.
- **Response 200**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "full_name": "Ramesh Patel",
      "state": "Karnataka",
      "district": "Dharwad",
      "village": "Navalgund",
      "preferred_language": "en"
    }
  }
  ```

### `PUT /api/v1/profile`
Updates farmer profile information.
- **Body**: `{ "full_name": string, "state": string, "district": string, "village": string, "preferred_language": "en" | "kn" | "hi" }`

### `DELETE /api/v1/profile`
Initiates account deletion and purges user-associated data.

---

## 2. Crop Suitability Engine

### `POST /api/v1/crop-recommendations`
Generates top recommended crops using Gemini AI based on soil and seasonal inputs.
- **Body**:
  ```json
  {
    "state": "Karnataka",
    "district": "Dharwad",
    "soilType": "BLACK_COTTON_REGUR",
    "soilPH": 7.2,
    "nitrogen": 240,
    "phosphorus": 14,
    "potassium": 280,
    "nutrientUnit": "kg/ha",
    "landArea": 3,
    "landUnit": "acre",
    "irrigationAvailability": "available",
    "season": "rabi",
    "previousCrop": "Tomato",
    "preferredLanguage": "en"
  }
  ```
- **Response 200**: Validated `CropRecommendationAIResponseSchema` containing top crops, suitability scores ($0-100\%$), management tips, risks, and missing data warnings.

### `GET /api/v1/crop-recommendations`
Returns all previous crop recommendation records for the authenticated user.

### `GET /api/v1/crop-recommendations/:id`
Retrieves a single historical recommendation by ID.

### `DELETE /api/v1/crop-recommendations/:id`
Deletes a recommendation record.

---

## 3. Soil Health Analysis

### `POST /api/v1/soil-analysis`
Digitizes a physical soil testing laboratory report.
- **Body**:
  ```json
  {
    "soilType": "BLACK_COTTON_REGUR",
    "ph": 7.4,
    "nitrogen": 240,
    "phosphorus": 14,
    "potassium": 280,
    "nutrientUnit": "kg/ha",
    "organicCarbon": 0.52,
    "electricalConductivity": 0.45,
    "preferredLanguage": "en"
  }
  ```
- **Response 200**: Condition overview, pH interpretation, NPK rating, soil amendment recommendations (Gypsum/Lime/FYM), and compatible crops.

---

## 4. Fertilizer Advisory

### `POST /api/v1/fertilizer-advisory`
Calculates growth stage-specific nutrient requirements.
- **Body**:
  ```json
  {
    "cropName": "Tomato",
    "growthStage": "FLOWERING_REPRODUCTIVE",
    "soilType": "BLACK_COTTON_REGUR",
    "landArea": 2.5,
    "landUnit": "acre",
    "previousFertilizer": "DAP 50kg basal",
    "preferredLanguage": "en"
  }
  ```

---

## 5. Precision Irrigation

### `POST /api/v1/irrigation-advisory`
Provides water budgeting, stress indicators, and conservation practices.
- **Body**:
  ```json
  {
    "cropName": "Paddy",
    "growthStage": "FLOWERING_REPRODUCTIVE",
    "soilType": "CLAY_LOAM",
    "irrigationMethod": "Alternate Wetting & Drying",
    "waterAvailability": "Adequate canal reserves",
    "environmentalData": { "recentRainfallMm": 0, "ambientTemperatureCelsius": 31 },
    "preferredLanguage": "en"
  }
  ```

---

## 6. Multimodal Plant Doctor (Disease Detection)

### `POST /api/v1/disease-detection`
Accepts `multipart/form-data`:
- `image`: Image file (JPEG, PNG, WebP $\le 8\text{ MB}$)
- `cropName`: string
- `growthStage`: string
- `affectedPart`: `LEAF` | `STEM` | `FRUIT_GRAIN` | `ROOT` | `WHOLE_PLANT`
- `symptomDurationDays`: number
- `symptoms`: string
- `preferredLanguage`: `en` | `kn` | `hi`

---

## 7. Conversational Chatbot

### `POST /api/v1/chat`
Maintains multi-turn context for conversational agricultural Q&A.
- **Body**:
  ```json
  {
    "conversationId": "optional-uuid",
    "message": "Which crop is best for black soil in rabi season?",
    "preferredLanguage": "en"
  }
  ```

---

## 8. Agricultural Sources & Health

### `GET /api/v1/sources`
Returns certified Indian agricultural reference sources (ICAR, DPPQ&S, IMD, SAUs).

### `GET /api/v1/health`
Health check endpoint returning service status.

