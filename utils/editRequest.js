exports.filterObj = (obj, ...allowerdFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowerdFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };