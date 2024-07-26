export function convert_objects() {
  const output = [];
  const temp = [];
  for (let i = 0; i < arguments.length; i++) { // Loop through all passed arguments (Objects, in this case)
    const obj = arguments[i]; // Save the current object to a temporary variable.
    if (obj.role && obj.value) { // If the object has a role and a value property
      if (temp.indexOf(obj.role) === -1) { // If the current object's role hasn't been seen before
        temp.push(obj.role); // Save the index for the current role
        output.push({ // push a new object to the output,
          role: obj.role,
          value: [obj.value], //   but change the value from a string to a array.
        });
      } else {
                // If the current role has been seen before
        output[temp.indexOf(obj.role)]
                    .value
                    .push(obj.value); // Save add the value to the array at the proper index
      }
    }
  }
  return output;
}

export function isEmpty(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) { return false; }
  }
  return true;
}
