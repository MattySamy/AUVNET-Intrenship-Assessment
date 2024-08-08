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

  getSubSubCategories() {
    const subSubCategories = [];
    for (
      let i = 0;
      i <
      this.category.subcategories[this.subcategoryIndex].subSubcategories
        .length;
      i++
    ) {
      subSubCategories.push(
        this.category.subcategories[this.subcategoryIndex].subSubcategories[i]
      );
    }
    return subSubCategories;
  }
}

module.exports = CategoryIterator;
