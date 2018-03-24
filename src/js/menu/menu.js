import {
    toggleAboutSection,
    toggleContent,
    changePage,
    closeContent,
} from "../utils/visibilityUtils";
import { initGame, getGame } from "../game/game";
import { GameConfig } from "../consts";

/**
 * Adds click event listeners to menu buttons
 */
export const addMenuButtonListeners = () => {
    //TODO disable button if there is no ongoing game
    document.querySelector(".lobby input[value=Resume]").addEventListener("click", () => {
        if (getGame()) {
            changePage();
        }
    });
    document.querySelector(".lobby input[value=Easy]").addEventListener("click",
        () => initGame(GameConfig.DIFFICULTY.EASY)
    );
    document.querySelector(".lobby input[value=Medium]").addEventListener("click",
        () => initGame(GameConfig.DIFFICULTY.MEDIUM)
    );
    document.querySelector(".lobby input[value=Hard]").addEventListener("click",
        () => initGame(GameConfig.DIFFICULTY.HARD)
    );

    const menuContentButtons =
        document.querySelectorAll(".lobby .lobby-content-box.menu .column")[1]
        .querySelectorAll("input");

    menuContentButtons.forEach(
        button => button.addEventListener("click",
            event => toggleContent(`${event.target.value.toLowerCase()}Content`)
        )
    );

    document.querySelectorAll(".lobby .arrow").forEach(
        arrow => arrow.addEventListener("click", () => {
            toggleAboutSection(event.path.find(
                el => el.classList && el.classList.contains("sub-section")
            ).id);
        })
    );

    document.querySelectorAll(".lobby .cross").forEach(
        cross => cross.addEventListener("click", closeContent)
    );
};