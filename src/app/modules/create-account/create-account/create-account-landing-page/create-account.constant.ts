export class CreateAccountConstant {
  static readonly SCREEN_NAME = "common";

  static readonly STATIC_DATA = {
    OWNERSHIP: [],
  };
}

export enum CreateEnum {
  SELF = "Self",
  OWNERSHIP = "OWNERSHIP",
  DUPLICATE_PRODUCT_ERROR_MESSAGE = "We have found similar account application in our record on your Mobile Number",
  DUPLICATE_PRODUCT_HINT = "Please visit bank for more information.",
  PRODUCT_DUPLICATION_KEY = "Accounts",
  SOURCE_PAYLOAD_KEY = "Website",
  LOADING_TEXT = "Saved",
}
