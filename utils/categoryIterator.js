class CategoryIterator {
  constructor(category) {
    this.category = category;
    this.subcategoryIndex = 0;
    this.subSubcategoryIndex = 0;
  }

  getSubCategories() {
    const subCategories = [];
    for (let i = 0; i < this.category.subcategories.length; i++) {
      subCategories.push(this.category.subcategories[i]);
    }
    return subCategories;
  }
}

module.exports = CategoryIterator;
