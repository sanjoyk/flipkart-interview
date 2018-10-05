class Feature {
  constructor(feature) {
    this.feature = feature
  }
}

class FeaturesList {
  constructor(featuresList) {
    this.initialize(featuresList);
    this.featuresList = [];
  }
  initialize(featuresList) {
    this.featuresList = featuresList.map(feature => new Feature(feature))
  }
}


class ProductComparison {
  constructor() {
    this.initialize();
    this.products = {};
    this.selectedProduct = [];
  }
  initialize() {
    this.getAllProducts();
  }
  getAllProducts() {
    FlipkartApi()
      .get("", (err, data) => {
        if (err) {
          alert(`Error: ${data.errorMessage}`);
          return
        }
        // debugger
        this.products = data.products;
        this.renderAddProductColumn();


        // this.renderProducts();
        // this.addEventListener();
      })
  }
  renderAddProductColumn() {
    const renderedOptions = Object.entries(this.products.compareSummary.titles)
      .map(([productId, { title, subtitle }]) => `<option value=${productId}>${title}</option>`)
      .join("");
    const renderSelectionOptions = `<select id="product-selection" onChange="renderProductDetails()">${renderedOptions}</select>`;
    const renderedProductColumn = `<div class"product-column">${renderSelectionOptions}</div> `;

    var wrapper = document.createElement('div');
    wrapper.innerHTML = renderedProductColumn;
    var div = wrapper.firstChild;

    const productContainer = $("#add-product-item");
    productContainer.insertBefore(div, productContainer.childNodes[0]);

  }
  renderParticularProduct(productId) {
    this.selectedProduct = [...this.selectedProduct, productId];

    this.createProductComparisonTable();
  }

  createProductComparisonTable() {
    let renderedComparisonTable = `<div class="compare-table">`;
    let header = "";
    header += `<div class="each-row"><h2>Compare</h2> <p>${this.selectedProduct.length} item selected</p></div>`;

    header += this.selectedProduct.map(productId => {
      return `<div style="width:200px;">
        <img style="width:200px;" src="${this.products.compareSummary.images[productId]}" alt="iamge">
        <h4>${this.products.compareSummary.titles[productId].title}</h4>
        </div>`;
    }).join("");


    renderedComparisonTable += header + "</div>";

    renderedComparisonTable += this.products.featuresList
      .map((featureType, index) => {
        debugger
        const { title, features = [] } = featureType;

        let eachRow = `<div style="padding:5px;">`;
        if (index === 0) {
          eachRow += `<span style="background-color:grey;">${title}</span>`;
        } else {
          eachRow += features.map(({ featureName, values }) => {
            let eachR = `<div style="display:inline-block;width:200px;padding:5px;">${featureName}</div>`;
            eachR += this.selectedProduct.map(productId => `<div style="display:inline-block;width:200px;padding:5px;">${values[productId]}</div>`)
            return eachR
          }).join("");


        }
        return eachRow + `</div>`;
      }).join("");



    renderedComparisonTable += "</div>";

    const productContainer = $("#products-list");
    productContainer.innerHTML = renderedComparisonTable;

  }
}
const renderProductDetails = (e) => {
  const productId = $("#product-selection").value;
  PRODUCT_COMPARISON.renderParticularProduct(productId);
}


var PRODUCT_COMPARISON = new ProductComparison();