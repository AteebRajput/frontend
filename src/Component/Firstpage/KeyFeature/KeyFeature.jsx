
import "./KeyFeature.css";

function KeyFeature() {
  return (
    <section className="features">
      <h2 className="features-title">
        <span>KEY </span>FEATURES
      </h2>
      <p className="features-subtitle">
      Unlock the potential of Agri Marketplace—empowering you and every link in the food supply chain for a smarter, more profitable future!
      </p>
      <div className="features-grid">
        <div className="feature-item">
          <img src="./transparency.svg" alt="Transparency" className="feature-icon" />
          <h3>TRANSPARENCY</h3>
          <p>Direct transactions between farmers and industry/retail</p>
        </div>
        <div className="feature-item">
          <img src="./fair-trade.svg" alt="Fairtrade" className="feature-icon" />
          <h3>FAIRTRADE</h3>
          <p>Redistribution of value in the food supply chain</p>
        </div>
        <div className="feature-item">
          <img src="./user-friendly.svg" alt="User Friendly" className="feature-icon" />
          <h3>USER FRIENDLY</h3>
          <p>Reduce costs to buyers without losing reliability</p>
        </div>
        <div className="feature-item">
          <img src="./trace.svg" alt="Food Traceability" className="feature-icon" />
          <h3>FOOD TRACEABILITY</h3>
          <p>Crop reliability through supply chain traceability (coming soon)</p>
        </div>
      </div>
    </section>
  );
}

export default KeyFeature;
