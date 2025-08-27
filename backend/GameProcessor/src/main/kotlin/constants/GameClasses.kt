package com.example.constants

import com.example.model.GameClass

object GameClasses {
    val classes: List<GameClass> = listOf(
        GameClass(
            name = "Russian",
            description = "Can drink half of what he has to, if he is drinking Vodka.",
            imageSrc = "/classes/russian.png"
        ),
        GameClass(
            name = "Pirate",
            description = "Can drink half of what he has to, if he is drinking Rum.",
            imageSrc = "/classes/pirate.png"
        ),
        GameClass(
            name = "Controlfreak",
            description = "Your votes are twice as strong.",
            imageSrc = "/classes/controlfreak.png"
        )
    )

    fun getClassByName(name: String): GameClass? {
        return classes.find { it.name == name }
    }
}