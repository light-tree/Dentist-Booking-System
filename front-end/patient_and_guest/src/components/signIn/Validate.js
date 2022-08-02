import { intervalToDuration } from "date-fns";

class Validate {
  validatePhone(phone) {
    let flag = true;
    if (phone.length !== 10) {
      flag = false;
    } else if (phone.at(0) != 0) {
      flag = false;
    }
    return flag;
  }

  validateLength(text, minLength, maxLength) {
    let flag = true;
    if (!(text.length >= minLength && text.length <= maxLength)) {
      flag = false;
    }
    return flag;
  }

  validateMinLength(text, minLength) {
    let flag = true;
    if (text.length < minLength) {
      flag = false;
    }
    return flag;
  }

  validateMaxLength(text, maxLength) {
    let flag = true;
    if (text.length >= maxLength) {
      flag = false;
    }
    return flag;
  }

  compare(text1, text2) {
    return text1 === text2;
  }

  //   vs
}

export default new Validate();
