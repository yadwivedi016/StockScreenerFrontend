import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import "../styles/SearchPage.css"; // Import CSS


const bseStocks = ['Reliance Industries', 'HDFC Bank', 'Tata Consultancy Services', 'Bharti Airtel', 'ICICI Bank', 'State Bank of India', 'Infosys', 'Hindustan Unilever', 'Bajaj Finance', 'ITC', 'LIC of India', 'Larsen & Toubro', 'Kotak Bank', 'Sun Pharmaceutical', 'HCL Technologies', 'Maruti Suzuki', 'NTPC', 'UltraTech Cement', 'Axis Bank', 'Mahindra & Mahindra', 'Bajaj Finserv', 'Titan', 'Oil & Natural Gas Corporation', 'Power Grid Corporation of India', 'Hindustan Aeronautics', 'Avenue Supermarts DMart', 'Adani Enterprises', 'Wipro', 'Adani Ports & SEZ', 'JSW Steel', 'Asian Paints', 'Coal India', 'Nestle', 'Tata Motors', 'Bajaj Auto', 'Bharat Electronics', 'Eternal', 'Interglobe Aviation', 'Adani Power', 'Indian Oil Corporation', 'Varun Beverages', 'Grasim Industries', 'Hindustan Zinc', 'Trent', 'IRFC', 'Tata Steel', 'DLF', 'Pidilite Industries', 'SBI Life Insurance', 'HDFC Life Insurance', 'Vedanta', 'Eicher Motors', 'Divis Laboratories', 'Jio Financial Services', 'Adani Green Energy', 'Ambuja Cements', 'Power Finance Corporation', 'Hyundai Motor India', 'Britannia Industries', 'Godrej Consumer Products', 'Hindalco Industries', 'Bharat Petroleum', 'Tech Mahindra', 'Bajaj Holdings & Investments', 'LTI Mindtree', 'Cholamandalam Investment', 'Bank of Baroda', 'TVS Motors', 'Shriram Finance', 'Tata Power', 'Cipla', 'GAIL', 'Macrotech Developers', 'Punjab National Bank', 'Shree Cement', 'Indian Hotels Company', 'Max Healthcare Institute', 'Tata Consumer Products', 'ABB', 'United Spirits', 'Torrent Pharmaceuticals', 'Rural Electrification Corporation', 'Adani Energy Solutions', 'Solar Industries', 'Apollo Hospitals', 'Indus Towers', 'Siemens', 'Mankind Pharma', 'Mazagon Dock Shipbuilders', 'Havells', 'Dr Reddys Laboratories', 'GMR Airports', 'Marico', 'Union Bank of India', 'ICICI Lombard General Insurance', 'Lupin', 'Muthoot Finance', 'Zydus Life Science', 'NHPC', 'IDBI Bank', 'JSW Energy', 'CG Power & Industrial Solutions', 'Info Edge', 'Dabur', 'ICICI Prudential Life Insurance', 'HDFC AMC', 'SRF', 'Hindustan Petroleum', 'SBI Cards', 'Jindal Steel', 'Canara Bank', 'Dixon Technologies', 'Samvardhana Motherson International', 'Bosch', 'Torrent Power', 'Cummins', 'Polycab', 'Bharat Heavy Electricals', 'Bharti Hexacom', 'Hero Motocorp', 'Indian Bank', 'Rail Vikas Nigam', 'Suzlon Energy', 'GIC of India', 'Persistent Systems', 'Colgate Palmolive', 'PB FinTech', 'Indian Overseas Bank', 'Patanjali Foods', 'Oracle Financial Services Software', 'Adani Total Gas', 'Berger Paints', 'Abbott', 'Aurobindo Pharma', 'JSW Infrastructure', 'Coromandel International', 'Lloyds Metals & Energy', 'Ashok Leyland', 'Godrej Properties', 'Alkem Laboratories', 'IRCTC', 'Oil India', 'Oberoi Realty', 'NMDC', 'Yes Bank', 'Phoenix Mills', 'United Breweries', 'Indusind Bank', 'One97 Communications', 'Kalyan Jewellers', 'Nykaa', 'Hitachi Energy', 'Linde', 'PI Industries', 'Fortis Healthcare', 'Bank of India', 'Tube Investment', 'MRF', 'Page Industries', 'Aditya Birla Capital', 'Bharat Dynamics', 'UNO Minda', 'Federal Bank', 'Prestige Estate', 'Schaeffler India', 'Bharat Forge', 'UPL', 'Jubilant FoodWorks', 'GlaxoSmithKline Pharmaceuticals', 'P&G Hygiene and Health Care', 'Balkrishna Industries', 'Tata Communications', 'Steel Authority of India', 'IDFC First Bank', 'L&T Technology Services', 'Petronet LNG', 'HUDCO', 'Jindal Stainless', 'Coforge', 'Voltas', 'Container Corporation of India', 'AU Small Finance Bank', 'APL Apollo Tubes', 'IREDA', 'Gujarat Fluorochemicals', 'Mphasis', 'Max Financial Services', 'ITC Hotels', 'Supreme Industries', 'Blue Star', 'Glenmark Pharmaceuticals', 'L&T Finance', 'JK Cement', 'ACC', 'Godrej Industries', 'Biocon', 'Thermax', 'Godfrey Phillips', 'Cochin Shipyard', 'SJVN', 'Adani Wilmar', 'Bank of Maharashtra', 'Escorts Kubota', 'Narayana Hrudayalaya', 'Motilal Oswal Financial Services', 'UCO Bank', 'Dalmia Bharat', 'Astral', 'Nippon Life India AMC', 'Global Health', 'IPCA Laboratories', '360 One WAM', 'M&M Financial Services', 'KPR Mill', '3M India', 'NLC India', 'Cholamandalam Financial Holdings', 'Radico Khaitan', 'CRISIL', 'Exide Industries', 'Kaynes Technology', 'LIC Housing Finance', 'Ajanta Pharma', 'Tata Investment Corporation', 'Laurus Labs', 'Aditya Birla Fashion', 'Honeywell Automation', 'Tata Elxsi', 'KPIT Technologies', 'Central Bank of India', 'AIA Engineering', 'Metro Brands', 'Gujarat Gas', 'Syngene International', 'Sumitomo Chemical', 'Piramal Pharma', 'IRB Infrastructure Developers', 'Poonawalla Fincorp', 'Aegis Logistics', 'Suven Pharmaceuticals', 'MCX', 'Authum Inv & Infr', 'NALCO', 'Emami', 'Endurance Technologies', 'Apollo Tyres', 'Sun TV Network', 'Gillette', 'Go Digit General Insurance', 'Chambal Fertilisers & Chemicals', 'The New India Assurance Company', 'Sona BLW Precision Forgings', 'Tata Technologies', 'KEI Industries', 'Deepak Nitrite', 'Indraprastha Gas', 'Aster DM Healthcare', 'ITI', 'PNB Housing Finance', 'J B Chemicals and Pharmaceuticals', 'Bandhan Bank', 'Krishna Institute of Medical Sciences', 'NBCC', 'Mangalore Refinery & Petroleum', 'Shyam Metalics & Energy', 'ZF Commercial', 'Gland Pharma', 'Motherson Sumi Wiring', 'Dr. Lal Path Labs', 'Ramco Cements', 'Jyoti CNC Automation', 'Brigade Enterprises', 'EIH Hotels', 'Firstsource Solutions', 'Piramal Enterprises', 'Bayer Crop Science', 'Crompton Greaves', 'Star Health Insurance', 'Amber Enterprises', 'Tata Chemicals', 'Poly Medicure', 'Five Star Business Finance', 'Hatsun Agro Product', 'Himadri Speciality Chemical', 'Angel One', 'AstraZeneca Pharma', 'CESC', 'Kansai Nerolac Paints', 'Navin Fluorine International', 'Aadhar Housing Finance', 'Affle India', 'Welspun Corp', 'PTC Industries', 'Castrol', 'Apar Industries', 'Nuvama Wealth Management', 'Vedant Fashions', 'Aditya Birla Real Estate', 'Manappuram Finance', 'Hindustan Copper', 'SKF India', 'BASF', 'Sundram Fasteners', 'Pfizer', 'Ratnamani Metals & Tubes', 'Inox Wind', 'Eris Lifesciences', 'Delhivery', 'Punjab & Sind Bank', 'Garden Reach Shipbuilders', 'Carborundum Universal', 'Aditya Birla Sun Life AMC', 'Devyani International', 'Computer Age Management Services', 'Amara Raja Energy & Mobility', 'KFin Technologies', 'KEC International', 'Grindwell Norton', 'Chalet Hotels', 'Timken', 'Bikaji Foods International', 'Concord Biotech', 'Alembic Pharmaceuticals', 'Gujarat State Petronet', 'TVS Holdings', 'Credit Access Grameen', 'Aavas Financiers', 'Redington', 'DCM Shriram Consolidated', 'Bata', 'Indian Energy Exchange', 'Jindal SAW', 'LMW', 'V-Guard Industries', 'Jupiter Wagons', 'ATUL', 'Triveni Turbines', 'Signature Global', 'Century Plyboards', 'Akzo Nobel', 'Rainbow Childrens Medicare', 'Asahi India Glass', 'PCBL Chemical', 'Kalpataru Projects International', 'Vinati Organics', 'Aptus Value Housing Finance', 'CIE Automotive', 'Anand Rathi Wealth', 'Deepak Fertilisers & Petrochemicals', 'Blue Dart Express', 'Godrej Agrovet', 'BLS International Services', 'Anant Raj Industries', 'Zensar Technologies', 'Tejas Networks', 'Action Construction Equipment', 'Jyothy Laboratories', 'JBM Auto', 'Sanofi', 'IIFL Finance', 'Ircon International', 'Schneider Electric Infra', 'Whirlpool', 'EID Parry', 'Natco Pharma', 'Kudremukh Iron Ore Company', 'Ramkrishna Forgings', 'HBL Engineering', 'Jubilant Pharmova', 'Finolex Cables', 'Caplin Point Laboratories', 'Nagarjuna Construction Company', 'Aarti Industries', 'Trident', 'UTI AMC', 'Cyient', 'Elgi Equipments', 'Capri Global Capital', 'Vardhman Textiles', 'Swan Energy', 'Newgen Software Technologies', 'Bombay Burmah Trading', 'Kajaria Ceramics', 'Great Eastern Shipping Company', 'Kirloskar Brothers', 'Mahanagar Gas', 'BEML', 'KSB', 'Clean Science & Technology', 'Fine Organic Industries', 'IndiaMART InterMesh', 'Maharashtra Scooters', 'Sobha', 'City Union Bank', 'Jai Balaji Industries', 'eClerx Services', 'Cello World', 'TBO Tek', 'Minda Corporation', 'Nuvoco Vistas Corporation', 'Supreme Petrochemicals', 'Zydus Wellness', 'Welspun Living', 'Lemon Tree Hotels', 'CEAT', 'Aether Industries', 'HFCL', 'Westlife Foodworld', 'IFCI', 'Tata Teleservices Maharashtra', 'Techno Electric & Engineering', 'Ingersoll Rand', 'Balrampur Chini Mills', 'Granules', 'Finolex Industries', 'RITES', 'Craftsman Automation', 'RBL Bank', 'Kirloskar Oil Engines', 'RR Kabel', 'J&K Bank', 'Relaxo Footwears', 'GR Infraprojects', 'Zee Entertainment', 'Eureka Forbes', 'NMDC Steel', 'Titagarh Rail Systems', 'Birlasoft', 'Jubilant Ingrevia', 'RHI Magnesita', 'JK Lakshmi Cement', 'Sapphire Foods', 'Home First Finance Company', 'CE Info Systems', 'Usha Martin', 'Medplus Health Services', 'Data Patterns', 'Chennai Petroleum Corporation', 'Praj Industries', 'Olectra Greentech', 'Star Cement', 'Engineers India', 'Sammaan Capital', 'Sonata Software', 'Quess Corp', 'JM Financial', 'Can Fin Homes', 'Graphite', 'Alkyl Amines Chemicals', 'PVR Inox', 'Procter & Gamble Health', 'TTK Prestige', 'HEG', 'GMDC', 'Intellect Design Arena', 'India Cements', 'Birla Corporation', 'Maharashtra Seamless', 'Happiest Minds Technologies', 'Garware Technical Fibres', 'Metropolis Healthcare', 'Anupam Rasayan', 'Kama Holdings', 'Alok Industries', 'CCL Products', 'Ujjivan Small Finance Bank', 'Latent View Analytics', 'Galaxy Surfactants', 'Sheela Foam', 'MMTC', 'Campus Activewear', 'Archean Chemical Industries', 'Mamaearth', 'ESAB India', 'GNFC', 'Cera Sanitaryware', 'Just Dial', 'Gujarat State Fertilizers & Chemicals', 'PNC Infratech', 'Rashtriya Chemicals & Fertilizers', 'Fairdeal Corporation', 'Mastek', 'Tamilnad Mercantile Bank', 'Chemplast Sanmar', 'Gujarat Pipavav Port', 'Prism Johnson', 'Equitas Small Finance Bank', 'Network 18 Media', 'Tanla Platforms', 'KNR Constructions', 'Varroc Engineering', 'Route Mobile', 'Mahindra Holidays', 'Sterling & Wilson Renewable Energy', 'Shree Renuka Sugars', 'Rajesh Exports', 'Shoppers Stop', 'Sunteck Realty', 'Mishra Dhatu Nigam', 'Sun Pharma Advanced Research Co', 'Laxmi Organic Industries', 'Mahindra Lifespaces', 'Easy Trip Planners', 'Balaji Amines'];


const BSESearchPage = () => {
  const [symbol, setSymbol] = useState("");
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  

  const handleSearch = (e) => {
    e.preventDefault();
    if (symbol.trim()) {
      navigate(`/bsestock/${symbol.trim()}`);
      setSymbol("");
      setFilteredStocks([]);
      setSelectedIndex(-1);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSymbol(value);

    if (value.trim() === "") {
      setFilteredStocks([]);
    } else {
      const filtered = bseStocks.filter((stock) =>
        stock.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStocks(filtered);
      setSelectedIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => Math.min(prev + 1, filteredStocks.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      setSymbol(filteredStocks[selectedIndex]);
      setFilteredStocks([]);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (stock) => {
    setSymbol(stock);
    setFilteredStocks([]);
  };

  return (
    <div className="search-container">
      <h1 className="search-title">Looking for a stock?</h1>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            value={symbol}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter stock symbol (e.g., Reliance, TCS)"
            className="search-input"
            aria-label="Search stock symbol"
          />
          <button type="submit" className="search-button" disabled={!symbol.trim()} aria-label="Search">
            Search
          </button>
        </div>
        {filteredStocks.length > 0 && (
          <ul className="suggestions-list">
            {filteredStocks.map((stock, index) => (
              <li
                key={stock}
                className={index === selectedIndex ? "suggestion-item active" : "suggestion-item"}
                onClick={() => handleSuggestionClick(stock)}
              >
                {stock}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default BSESearchPage;
