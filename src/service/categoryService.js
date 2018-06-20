const _storageKey = 'shopp';
const _categoriesKey = _storageKey + '.categories';
const _categorySelectedIdKey = _storageKey + '.categoryLastSelectedId';
//Category: {Id:0, Name:'Kroger', IsDeleted: false, IsUploaded : false}
//ListItem: {Id:0, Category:0, Description:'Milk', IsCompleted: true, IsDeleted: false, IsUploaded : false}
const categoryService = {
  getCategories(callback) {
    let categories = JSON.parse(localStorage.getItem(_categoriesKey));
    if (categories !== null) {
      if (callback)
        callback(
          categories.filter(function(c) {
            return c.IsDeleted === false;
          })
        );
    } else {
      this.seed(defaultRecords => {
        if (callback) callback(defaultRecords);
      });
    }
  },
  getCategory(id, categories, callback) {
    if (categories === null) {
      this.getCategories(categories => {
        let match = categories.filter(function(c) {
          return c.Id === parseInt(id, 10);
        });
        if (callback) callback(match.length === 1 ? match[0] : {});
      });
    } else {
      let match = categories.filter(function(c) {
        return c.Id === parseInt(id, 10);
      });
      if (callback) callback(match.length === 1 ? match[0] : {});
    }
  },
  addCategory(name, categories, callback) {
    if (categories === null)
      categories = this.getCategories(categories => {
        this.getNextId(categories, newId => {
          categories.push({
            Id: newId,
            Name: name,
            IsDeleted: false,
            IsUploaded: false
          });
          localStorage[_categoriesKey] = JSON.stringify(categories);
          if (callback) callback(newId);
        });
      });
  },
  saveCategory(id, name, isDeleted, callback) {
    this.getCategories(categories => {
      this.getCategory(id, categories, existingRecord => {
        let i = categories.indexOf(existingRecord);
        if (i > -1) {
          categories[i] = {
            Id: existingRecord.Id,
            Name: name,
            IsDeleted: isDeleted,
            IsUploaded: false
          };
          localStorage[_categoriesKey] = JSON.stringify(categories);
          if (callback) callback(id);
        } else {
          this.addCategory(name, categories, newId => {
            if (callback) callback(newId);
          });
        }
      });
    });
  },
  deleteCategory(id, callback) {
    this.getCategories(categories => {
      this.getCategory(id, categories, existingRecord => {
        this.saveCategory(existingRecord.Id, existingRecord.Name, true, id => {
          if (callback) callback(id);
        });
      });
    });
  },
  saveSelectedCategoryId(id) {
    localStorage[_categorySelectedIdKey] = id;
  },
  getSelectedCategoryId(callback) {
    let selectedId = localStorage.getItem(_categorySelectedIdKey);
    if (selectedId !== null) {
      this.getCategory(selectedId, null, category => {
        if (callback) callback(category);
      });
    } else {
      if (callback) callback(null);
    }
  },
  getNextId(records, callback) {
    if (records === null) return -1;
    let maxId = 0;
    for (var i = 0; i < records.length; i++) {
      if (records[i].Id > maxId) maxId = records[i].Id;
    }
    if (callback) callback(maxId + 1);
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
    if (callback) callback(categories);
  }
};

export default categoryService;
