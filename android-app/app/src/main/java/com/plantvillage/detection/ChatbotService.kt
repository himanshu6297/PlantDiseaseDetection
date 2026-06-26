package com.plantvillage.detection

import kotlin.random.Random

/**
 * Chatbot service for providing disease management advice
 * Uses template-based responses for MVP (can be enhanced with API later)
 */
class ChatbotService {
    private val diseaseAdvice = mapOf(
        // Apple
        "Apple___Apple_scab" to listOf(
            "Apple scab is caused by fungus. Remove infected leaves and improve air circulation.",
            "Use fungicide sprays during early spring to prevent scab.",
            "Prune trees to increase air flow and reduce moisture."
        ),
        "Apple___Black_rot" to listOf(
            "Black rot is a serious fungal disease. Remove all infected branches immediately.",
            "Apply copper-based fungicide before fruiting season.",
            "Avoid overhead watering to prevent spore spread."
        ),
        "Apple___Cedar_apple_rust" to listOf(
            "This alternates between apple and cedar trees. Remove nearby cedars if possible.",
            "Apply sulfur fungicide in early spring.",
            "Resistant apple varieties are the best long-term solution."
        ),
        "Apple___healthy" to listOf(
            "Your apple tree looks healthy! Continue regular maintenance.",
            "Inspect regularly for early signs of disease.",
            "Maintain proper pruning and fertilization schedule."
        ),
        // Blueberry
        "Blueberry___healthy" to listOf(
            "Your blueberry plant is in great condition!",
            "Ensure adequate drainage and acidic soil (pH 4.5-5.5).",
            "Water consistently during growing season."
        ),
        // Cherry
        "Cherry_(including_sour)___Powdery_mildew" to listOf(
            "Powdery mildew appears as white coating on leaves.",
            "Apply sulfur or neem oil spray weekly during infection.",
            "Improve air circulation by pruning dense branches."
        ),
        "Cherry_(including_sour)___healthy" to listOf(
            "Your cherry tree is healthy! Beautiful!",
            "Continue with regular watering and pruning.",
            "Monitor for early signs of disease in spring."
        ),
        // Corn
        "Corn_(maize)___Cercospora_leaf_spot_(Gray_leaf_spot)" to listOf(
            "Gray leaf spot causes rectangular lesions on leaves.",
            "Rotate crops and remove infected plant debris.",
            "Use resistant corn varieties if available."
        ),
        "Corn_(maize)___Common_rust" to listOf(
            "Common rust appears as rust-colored pustules.",
            "Apply fungicide when signs first appear.",
            "Practice crop rotation to reduce fungal spores."
        ),
        "Corn_(maize)___Northern_Leaf_Blight" to listOf(
            "Northern leaf blight causes elongated lesions.",
            "Use resistant hybrids and practice crop rotation.",
            "Fungicide can be effective if applied early."
        ),
        "Corn_(maize)___healthy" to listOf(
            "Your corn crop looks excellent!",
            "Continue regular watering and nutrient management.",
            "Monitor for pests alongside disease prevention."
        ),
        // Grape
        "Grape___Black_measles" to listOf(
            "Black measles is a serious grapevine disease.",
            "Remove and destroy infected vines completely.",
            "Disinfect pruning tools between cuts."
        ),
        "Grape___Esca_(Black_Measles)" to listOf(
            "Esca causes decline symptoms on grapevines.",
            "There's no cure; focus on prevention and management.",
            "Remove infected wood and apply wound dressing."
        ),
        "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)" to listOf(
            "Leaf blight causes brown spots on grape leaves.",
            "Apply copper fungicide during rainy periods.",
            "Improve air circulation through proper trellising."
        ),
        "Grape___healthy" to listOf(
            "Your grape plants are thriving!",
            "Maintain consistent irrigation during growing season.",
            "Continue regular monitoring for diseases."
        ),
        // Orange
        "Orange___Haunglongbing_(Citrus_greening)" to listOf(
            "Huanglongbing (citrus greening) is extremely serious.",
            "There's currently no cure; prevention is critical.",
            "Remove infected trees to protect nearby citrus."
        ),
        // Peach
        "Peach___Bacterial_spot" to listOf(
            "Bacterial spot causes dark lesions on leaves and fruit.",
            "Apply copper-based bactericide during dormant season.",
            "Remove infected branches immediately."
        ),
        "Peach___healthy" to listOf(
            "Your peach tree is in excellent health!",
            "Maintain regular watering during dry periods.",
            "Thin fruit in early season for larger peaches."
        ),
        // Pepper
        "Pepper,_bell___Bacterial_spot" to listOf(
            "Bacterial spot is a serious pepper disease.",
            "Use disease-free seeds and rotate crops yearly.",
            "Avoid overhead watering to reduce bacterial spread.",
            "Apply copper fungicide as a preventative measure."
        ),
        "Pepper,_bell___healthy" to listOf(
            "Your peppers look great! Keep up the good work!",
            "Ensure consistent watering and proper spacing.",
            "Stake plants for support as they grow."
        ),
        // Potato
        "Potato___Early_blight" to listOf(
            "Early blight causes concentric circles on lower leaves.",
            "Remove lower leaves when disease appears.",
            "Apply fungicide and practice crop rotation."
        ),
        "Potato___Late_blight" to listOf(
            "Late blight is devastating to potatoes.",
            "Plant resistant cultivars when available.",
            "Apply fungicide consistently during cool, wet weather."
        ),
        "Potato___healthy" to listOf(
            "Your potato crop is looking very healthy!",
            "Continue regular monitoring for blight signs.",
            "Harvest when plants are completely dry."
        ),
        // Strawberry
        "Strawberry___Angular_Leaf_Spot" to listOf(
            "Angular leaf spot causes v-shaped lesions.",
            "Remove and destroy infected leaves.",
            "Apply fungicide and improve air circulation."
        ),
        "Strawberry___healthy" to listOf(
            "Your strawberries are beautiful and healthy!",
            "Keep plants well-watered during fruiting.",
            "Remove runners to focus energy on fruit production."
        ),
        // Soybean
        "Soybean___Bacterial_pustule" to listOf(
            "Bacterial pustule appears as small, raised lesions.",
            "Use disease-free seeds and practice crop rotation.",
            "No chemical control is highly effective."
        ),
        "Soybean___Frog_eye_leaf_spot" to listOf(
            "Frog eye leaf spot causes circular lesions.",
            "Apply fungicide when humidity is high.",
            "Remove crop residue after harvest."
        ),
        "Soybean___Powdery_mildew" to listOf(
            "Powdery mildew can reduce soybean yields.",
            "Apply sulfur or oil-based fungicide.",
            "Plant resistant varieties when available."
        ),
        "Soybean___healthy" to listOf(
            "Your soybean plants are thriving!",
            "Continue regular monitoring throughout season.",
            "Ensure proper fertilization and irrigation."
        ),
        // Squash
        "Squash___Powdery_mildew" to listOf(
            "Powdery mildew is common on squash.",
            "Apply sulfur or neem oil weekly.",
            "Space plants for better air circulation."
        ),
        // Tomato
        "Tomato___Early_blight" to listOf(
            "Early blight starts on lower leaves.",
            "Remove infected leaves and apply fungicide.",
            "Improve air circulation through pruning."
        ),
        "Tomato___Late_blight" to listOf(
            "Late blight is devastating in cool, wet weather.",
            "Apply fungicide as soon as symptoms appear.",
            "Remove entire affected plants if severe."
        ),
        "Tomato___Leaf_Mold" to listOf(
            "Leaf mold causes yellow spots with gray mold.",
            "Improve ventilation in greenhouse or high-humidity areas.",
            "Apply fungicide and remove infected leaves."
        ),
        "Tomato___Septoria_leaf_spot" to listOf(
            "Septoria leaf spot causes small circular lesions.",
            "Remove lower infected leaves regularly.",
            "Apply copper fungicide preventatively."
        ),
        "Tomato___Spider_mites_(Two-spotted_spider_mite)" to listOf(
            "Spider mites cause stippling on leaves.",
            "Spray with water to dislodge mites.",
            "Use miticide if infestation is severe."
        ),
        "Tomato___Target_Spot" to listOf(
            "Target spot creates concentric rings on leaves.",
            "Apply fungicide and improve air flow.",
            "Remove lower infected leaves."
        ),
        "Tomato___Tomato_mosaic_virus" to listOf(
            "Mosaic virus causes mottled, distorted leaves.",
            "Remove infected plants (no cure available).",
            "Wash hands and tools to prevent spread."
        ),
        "Tomato___Bacterial_wilt" to listOf(
            "Bacterial wilt causes rapid plant decline.",
            "Remove entire plant and destroy it.",
            "Control insect vectors to prevent spread."
        ),
        "Tomato___healthy" to listOf(
            "Your tomato plants look fantastic!",
            "Ensure consistent watering and sun exposure.",
            "Prune suckers for better air circulation."
        )
    )

    fun getAdvice(className: String): String {
        val adviceList = diseaseAdvice[className] ?: listOf(
            "Keep monitoring this plant closely.",
            "Consult local agricultural extension for specific guidance.",
            "Maintain good plant health through proper care."
        )
        return adviceList[Random.nextInt(adviceList.size)]
    }

    fun getGreeting(): String {
        val greetings = listOf(
            "Hello! I'm your Plant Health Advisor. How can I help?",
            "Welcome! Ready to help you keep your plants healthy!",
            "Hi there! What plant would you like to discuss today?",
            "Let's keep your garden healthy! What can I help with?"
        )
        return greetings[Random.nextInt(greetings.size)]
    }

    fun getFollowUpQuestion(className: String): String {
        val followUps = listOf(
            "Would you like tips on preventing this issue?",
            "Do you need specific treatment recommendations?",
            "Would you like more detailed preventive measures?",
            "Is there anything else about this plant you'd like to know?"
        )
        return followUps[Random.nextInt(followUps.size)]
    }
}
