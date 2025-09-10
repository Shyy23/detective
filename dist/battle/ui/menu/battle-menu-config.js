import { FONT_ASSET_NAME } from "../../../assets/font-keys.js";
import Phaser from "../../../lib/phaser.js";

/** @type {Phaser.Types.GameObjects.Text.TextStyle} */
export const BATTLE_UI_TEXT_STYLE = Object.freeze({
  fontFamily: FONT_ASSET_NAME.KENNY_FUTURE_NARROW,
  color: "#DDD393",
  fontSize: "30px",
  fontStyle: "bold",
});
export const SUB_BATTLE_UI_TEXT_STYLE = Object.freeze({
  fontFamily: FONT_ASSET_NAME.KENNY_FUTURE_NARROW,
  color: "black",
  fontSize: "30px",
  fontStyle: "bold",
});

export const MENU_UI_TEXT_STYLE = Object.freeze({
  fontFamily: FONT_ASSET_NAME.PIXELIFY,
  color: "#802A2C",
  fontSize: "24px",
  // fontStyle: "bold",
});
export const MENU_UI_SELECT_NUMBER_STYLE = Object.freeze({
  fontFamily: FONT_ASSET_NAME.PIXELIFY,
  color: "white",
  fontSize: "24px",
  // fontStyle: "bold",
});

export const MENU_UI_TITLE_STYLE = Object.freeze({
  fontFamily: FONT_ASSET_NAME.PIXELIFY,
  color: "white",
  fontSize: "60px",
  fontStyle: "bold",
});

export const WORLD_UI_TEXT_STYLE = Object.freeze({
  fontFamily: FONT_ASSET_NAME.KENNY_FUTURE_NARROW,
  color: "white",
  fontSize: "32px",
  fontStyle: "bold",
  wordWrap: { width: 0 },
});
export const VN_UI_TEXT_STYLE = Object.freeze({
  fontFamily: FONT_ASSET_NAME.KENNY_FUTURE_NARROW,
  color: "white",
  fontSize: "20px",
  fontStyle: "bold",
  wordWrap: { width: 0 },
});

export const NAME_VN_TEXT_STYLE = Object.freeze({
  fontFamily: FONT_ASSET_NAME.KENNY_FUTURE_NARROW,
  color: "white",
  fontSize: "24px",
  fontStyle: "bold",
  wordWrap: { width: 0 },
});
