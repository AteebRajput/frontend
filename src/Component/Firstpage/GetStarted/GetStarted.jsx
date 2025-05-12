import './GetStarted.css'

function GetStarted() {
  return (
    <div>
      <section className="get-started">
        <h1 className="title">Get  <span>Started</span></h1>
        <p className="description">
          We open the door to thousands of approved buyers and sellers. Post
          your crop bid as a registered buyer, or create your crop offer as a
          platform verified seller. Through our rigorous customer compliance, we
          make sure that only reliable users gain access to our digital
          marketplace. There are two ways to get started:
        </p>
        <div className="options">
          <div className="option">
            <h2>Post Offer as a Seller</h2>
            <p>
              As a seller, post offers for the agricultural crop you are looking
              to sell, and gain immediate access to credit-verified buyers. Or
              simply react to an existing buyer’s bid and start your
              transaction.
            </p>
            <div className="buttons">
              <button className="btn">Register as a Seller</button>
              <button className="btn secondary">Selling Offer Video</button>
            </div>
          </div>

          <div className="option">
            <h2>Post Bid as a Buyer</h2>
            <p>
              As a buyer, post bids for the agricultural crop you are looking to
              buy. Communicate to the market what you are looking for, and get
              rapid reactions from interested farmers or sellers.
            </p>
            <div className="buttons">
              <button className="btn">Register as a Buyer</button>
              <button className="btn secondary">Buying Bid Video</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GetStarted;
