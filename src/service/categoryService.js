const _storageKey = 'shopp';
const _categoriesKey = _storageKey + '.categories';
const _categorySelectedIdKey = _storageKey + '.categoryLastSelectedId';
//Category: {Id:0, Name:'Kroger', IsDeleted: false, IsUploaded : false}
//ListItem: {Id:0, Category:0, Description:'Milk', IsCompleted: true, IsDeleted: false, IsUploaded : false}
const categoryService = {
  getCategories(callback) {
    let categories = JSON.parse(localStorage.getItem(_categoriesKey));
    if (categories !== null) {
      callback(
        categories.filter(function(c) {
          return c.IsDeleted === false;
        })
      );
    } else {
      this.seed(defaultRecords => {
        callback(defaultRecords);
      });
    }
  },
  getCategory(id, categories, callback) {
    if (categories === null) {
      categories = this.getCategories(response => {
        categories = response;
        let match = categories.filter(function(c) {
          return c.Id === parseInt(id, 10);
        });
        callback(match.length === 1 ? match[0] : {});
      });
    } else {
      let match = categories.filter(function(c) {
        return c.Id === parseInt(id, 10);
      });
      callback(match.length === 1 ? match[0] : {});
    }
  },
  addCategory(name, categories, callback) {
    if (categories === null) categories = this.getCategories();
    this.getNextId(categories, newId => {
      categories.push({
        Id: newId,
        Name: name,
        IsDeleted: false,
        IsUploaded: false
      });
      localStorage[this._categoriesKey] = JSON.stringify(categories);
      callback(newId);
    });
  },
  saveCategory(id, name, isDeleted, callback) {
    let response = null;
    let categories = this.getCategories();
    let existingRecord = this.getCategory(id, categories);
    let i = categories.indexOf(existingRecord);
    if (i > -1) {
      categories[i] = {
        Id: existingRecord.Id,
        Name: name,
        IsDeleted: isDeleted,
        IsUploaded: false
      };
      localStorage[this._categoriesKey] = JSON.stringify(categories);
      response = id;
    } else {
      response = this.addCategory(name, categories, callback);
    }
    callback(response);
  },
  deleteCategory(id, callback) {
    let response = null;
    let categories = this.getCategories();
    let existingRecord = this.getCategory(id, categories);
    response = this.saveCategory(
      existingRecord.Id,
      existingRecord.Name,
      true,
      callback
    );
    callback(response);
  },
  saveSelectedCategoryId(id) {
    localStorage[_categorySelectedIdKey] = id;
  },
  getSelectedCategoryId(callback) {
    let selectedId = localStorage.getItem(_categorySelectedIdKey);
    if (selectedId !== null) {
      this.getCategory(selectedId, null, response => {
        callback(response);
      });
    } else {
      callback(null);
    }
  },

  getNextId(records, callback) {
    let response = null;
    if (records === null) return -1;
    let maxId = 0;
    for (var i = 0; i < records.length; i++) {
      if (records[i].Id > maxId) maxId = records[i].Id;
    }
    response = maxId + 1;
    callback(response);
  },
  seed(callback) {
    let categories = [];
    this.getNextId(categories, newId => {
      categories.push({
        Id: newId,
        Name: 'Kroger',
        IsDeleted: false,
        IsUploaded: false
      });
    });
    this.getNextId(categories, newId => {
      categories.push({
        Id: newId,
        Name: 'Target',
        IsDeleted: false,
        IsUploaded: false
      });
    });
    localStorage[_categoriesKey] = JSON.stringify(categories);
    callback(categories);
  }
};

export default categoryService;
