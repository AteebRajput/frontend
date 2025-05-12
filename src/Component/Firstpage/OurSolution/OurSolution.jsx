
import "./OurSolution.css";

const OurSolution = () => {
  return (
    <div className="solution-section">
      <h1 className="solution-title">
        <span>OUR</span> SOLUTION
      </h1>
      <p className="solution-description">
        Pak AgriTech is a transformative digital B2B platform that bridges the
        gap between Farmers and Industrial Buyers, revolutionizing agricultural
        trade and fostering direct, efficient partnerships.
      </p>

      <div className="solution-content">
        <div className="left-container">
          <div className="venn-diagram">
            <div className="circle circle1">
              <div className="text">
                <ul>
                  <li>
                    <p>Farmer</p>
                  </li>
                  <li>
                    <p>Cooperatives</p>
                  </li>
                  <li>
                    <p>Olive Oils Mills</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="circle circle2">
              <div className="text">
                <ul>
                  <li>
                    <p>Food Processors</p>
                  </li>
                  <li>
                    <p>Food Manufacturers</p>
                  </li>
                  <li>
                    <p>Food Retailers</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="overlap">
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/leaf.png"
                alt="Leaf Icon"
              />
            </div>
          </div>
        </div>

        <div className="solution-details right-container">
          <p>
            We drive agricultural transactions through our digital platform in
            combination with our service partnership network. AgriTech
            Marketplace accommodates online payments between buyer and seller,
            product quality check options, and end-to-end logistic services.
          </p>
          <p className="second-para">
            Agri Marketplace does not buy or sell crops and is not a broker.
            Instead, we offer you the ability to effortlessly market your crop
            via our platform.
          </p>
          <div className="action-buttons">
            <button className="explore-button">Explore Marketplace</button>
            <button className="learn-more-button">Learn More About Us</button>
          </div>
        </div>
      </div>

      <div className="solution-benefits">
        <ul>
          <li>
            A user-friendly platform that generates market opportunity for
            farmers and industry buyers.
          </li>
          <li>
            Unlimited access to a global market from anywhere, at anytime.
          </li>
          <li>
            Transparent and reliable market information, deal creation and
            negotiation.
          </li>
          <li>Integrated and secure platform payment processes.</li>
          <li>Tailored product quality verification and logistic services.</li>
          <li>A market with only verified buyers and sellers.</li>
          <li>Customer support & insight.</li>
        </ul>
      </div>
    </div>
  );
};

export default OurSolution;
