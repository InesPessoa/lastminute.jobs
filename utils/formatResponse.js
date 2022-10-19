class FormatResponse {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    limitFields() {
      let reqFields = this.queryString.fields;
      if (reqFields) {
        reqFields = reqFields.replace(/\b(,)\b/g, ' ');
        this.query = this.query.select(reqFields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
  
    paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }
  
  module.exports = FormatResponse;