export const isUndefined = (obj, _undefined) => obj == _undefined;
export const isString = (value) => typeof value === "string";

export default class CustomForm {
  constructor(args, submitFunction) {
    this._id =
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9);
    this.options = args;
    this.submit = submitFunction;
    this.requiredFields =
      args.requiredFields ||
      args.requires ||
      args.fields
        .filter((f) => f.required)
        .map((f) => (isString(f) ? f : f.name));
    this.fields = args.fields.map((f) => (isString(f) ? f : f.name));
    for (let f = 0; f < this.requiredFields.length; f++) {
      this[this.requiredFields[f]] = null;
    }
    if (!submitFunction)
      throw "(Arg n.2 'submitFunction') The function calling on submit is required";
    this.invalid = {};
  }
  reset() {
    this.fields.forEach((f) => {
      this[f] = null;
    });
  }

  createInvalidMessage(element, message) {
    if (element) {
      let span = document.createElement("span");
      span.className = "custom-form-" + this._id + " custom-required";
      span.innerText = message || "Campo obrigatório";
      element.after(span);
    }
  }

  invalidateRequireds() {
    if (!this.requiredFields) return;
    for (let f = 0; f < this.requiredFields.length; f++) {
      if (
        this[this.requiredFields[f]] == null ||
        isUndefined(this[this.requiredFields[f]])
      ) {
        this.invalid[this.requiredFields[f]] = true;
        this.createInvalidMessage(
          document.querySelector("#" + this.requiredFields[f])
        );
      }
      //this[this.requiredFields[f]]= null;
    }
  }

  fulfill(model) {
    this.fields.forEach((f) => {
      this[f] = model[f];
    });
  }
  invalidate() {
    this.invalid = {};
    this.invalidateRequireds();
    // TODO ADD Custom Validations other than required and required that are conditionals
  }

  convert() {
    let result = {};
    this.fields.forEach((f) => {
      result[f] = this[f];
    });
    return result;
  }

  clear() {
    document
      .querySelectorAll(".custom-form-" + this._id)
      .forEach((e) => e.parentNode.removeChild(e));
  }
  callSubmit() {
    console.log("callSubmit");
    this.clear();
    this.invalidate();
    console.log(this.convert());
    if (Object.keys(this.invalid).length) {
      return;
    } else this.submit(this.convert());
  }
  //For some bloddy reason this shit isnot working anymore had to change name
 /*  submit() {
    console.log("Hit submit");
    this.clear();
    this.invalidate();
    console.log(this.convert());
    if (Object.keys(this.invalid).length) {
      return;
    } else this.submit(this.convert());
  } */
}
