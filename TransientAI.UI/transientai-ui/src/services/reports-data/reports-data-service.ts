import { ResearchReport } from './model';

class ReportsDataService {

  getReports(): ResearchReport[] {
    return [
      {
        name: 'GS: Ruminations - Macro, Micro',
        aiSummary: this.getAiContentMock(),
        emailContent: this.getEmailContentMock()
      },
      {
        name: 'GS Spec Sales: Feedback, Flows and Catalysts',
        aiSummary: this.getAiContentMock(),
        emailContent: this.getEmailContentMock()
      },
      {
        name: 'BNP Paribas Exane Research - 2025 - The Pricey Paradise',
        aiSummary: this.getAiContentMock(),
        emailContent: this.getEmailContentMock()
      }
    ];
  }

  getEmailContentMock() {
    return `# Ruminations - Macro, Micro, Markets

**From:** "Molavi, Bobby" <Bobby.Molavi@gs.com>  
**Date:** January 15, 2025 at 6:22:56 AM EST  
**To:** Chris Napoli Research <chrisnapoli.research@hurricanecap.com>  
**Subject:** Ruminations - Macro, Micro, Markets  
**Reply-To:** "Molavi, Bobby" <Bobby.Molavi@gs.com>  

---

The 2-day first week of January behind us… then the week of saying Happy New Year behind us… we now find ourselves truly back to school and getting into the swing of things.

### **Market Overview**
It has already been a **choppy start to 2025**. The initial **euphoria** from the Trump victory, the Bessent announcement, and deregulation-driven optimism is now **faltering**.  
The **US market reversal last week** highlights the view that *"where Nvidia goes, the market follows"*—with **Nvidia down ~10%** from its **Jan 6th all-time high**.  

- **Global equities** have been sold in **3 of the last 4 weeks**, driven by **short-book growth**.  
- **Inflation, re-inflation, and yields** remain the central focus.
- **US 10-year and 30-year bonds** have seen material rises, with the **10-year nearing 5%**.
- **UK 10-year bonds** have reached levels unseen since **2008**, affecting GBP stability.

### **Key Themes for 2025**
- **Private Assets Expansion**:  
  - **Private Credit** has shifted from **welterweight to heavyweight**.
  - **Private Equity (PE)** has grown from **$1 trillion AUM to $12 trillion** in a short period.  
- **Equity Market Narrowness**:  
  - **5 US stocks** account for ~20% of global market cap.
  - **50% of S&P 500's 2024 returns** came from **7 stocks** (Mag 7 / Granolas).
- **Trump 2.0 Impact**:  
  - Expect **headline risks** and **market volatility**.
  - Deregulation could **reshape corporate M&A strategy**.
- **MENA Region Focus**:  
  - Increased **capital allocations** and **office expansions** in the Middle East.
- **European Economic Challenges**:  
  - **Overregulation and low growth** threaten competitiveness.
  - **Potential for cross-border M&A** in response to weak GDP growth.

### **Indexation and Correlation Trends**
- Markets have become **more passive**, with ETFs and quant strategies driving **momentum-based growth**.  
- **Momentum investing** creates an environment where **investors "must" buy rising stocks**, fueling valuation growth.  
- **Nvidia's market cap surged from $1T → $2T → $3.3T** in a short period, partly due to technical momentum.  

### **Market Evolution**
- Investors rely on **factors, volatility, and risk models**, which have **not been tested in high-volatility cycles**.
- Will **central bank independence**, **US dollar dominance**, and **globalization trends** hold in the future?

---

## **Regional & Macro Considerations**

### **UK Markets**
- **Capital flight & regulatory burdens** make UK assets **less attractive**.
- **Labour market policies** need reform to stimulate **growth and incentives**.

### **Trump 2.0**
- Expect **tariff discussions**, **regulatory shifts**, and **geo-political headlines**.
- Possible **deglobalization effects** on global trade.

### **Natural Disasters & Inflation**
- **LA fires and climate risks** drive **insurance costs higher**, adding to **stealth inflation**.
- **Florida property market** faces **rising risk exposure**, with **state-backed insurance funds undercapitalized**.

---

## **Asset Management Industry Trends**
- Shift from **intuition-based** investing to **process-driven** strategies.
- Growth of **private credit** and **direct lending** as an alternative to public markets.
- **M&A activity rebounding**, with **large-cap PE funds** re-entering the market.

### **Venture Capital (VC) Landscape**
- **2023 was a tough year** for VC:  
  - Capital calls exceeded distributions by **80%**.  
  - **Private secondary markets** traded at an average **68% discount**.  
  - **Fundraising times stretched to record highs** (20.1 months).  
- **AI investment boom**:
  - **Unclear where terminal value lies** (LLMs, API layers, applications?).
  - **Massive capex requirements** could consolidate power in a few dominant firms.

### **Buybacks Driving Markets**
- **$1 trillion in US buybacks** in 2024.
- The **Magnificent 7** accounted for **26% of all buybacks** in 2023.
- **Companies compensating for lack of investor demand** via aggressive repurchases.

---

## **Investor Psychology & Market Behavior**
- **Cognitive biases shape investment decisions**:
  - Investors **often fight the last crisis** rather than preparing for new challenges.
  - **2023 saw persistent bearish sentiment**, despite strong market performance.
- **Generational Investing Bias**:
  - **1950s investors saw near-zero inflation-adjusted returns**.
  - **1970s investors saw a 10x return** over 20-30 years.

---

## **Private Equity (PE) Vintages & M&A Trends**
- **Exit activity remains low**, with many PE firms **delaying IPOs**.
- **2019 & 2020 PE funds face challenges** due to:
  - **High valuations during deployment**.
  - **Rising interest rates affecting exit multiples**.
- **Corporate M&A picking up**:
  - **US companies leveraging strong balance sheets for acquisitions**.
  - **European firms showing signs of cross-border consolidation**.

---

## **Key Market Charts & Data**
### **1. CPI Impact on S&P 500**
| Core CPI MoM | S&P 500 Reaction |
|-------------|----------------|
| <0.15% | +1.80% |
| 0.15%-0.22% | +1.40% |
| 0.23%-0.28% (GSe 0.25%) | +0.80% |
| 0.29%-0.34% | ±0.40% |
| 0.35%-0.39% | -1.00% |
| >0.40% | -2.00% |

- **SPX implied move through tomorrow’s close = ~1.15%**  

### **2. CEO Confidence vs Bull/Bear Sentiment**
![CEO Confidence vs Bull/Bear Sentiment](da217f7d-26bf-4902-928f-4e4f53b5c63f.png)

### **3. Interest Rate Reaction to Rate Cut Cycles**
![Rates reaction](f38c2675-4165-457c-9408-061deb1506b7.png)

### **4. Regional Productivity Differentials**
![Productivity](81f01620-bb50-4dc4-86f1-7704cea0a4e9.png)

### **5. Global Capital Flows**
![Capital Flows](8e51886c-9545-4ef5-9b65-efc28bc0753e.png)

### **6. Active vs Passive Investing Trends**
![Active vs Passive](f239174d-c78b-4a7b-84b9-7498886ab016.png)

### **7. Market Concentration: Top 10 Stocks vs 75th Percentile**
![Market Concentration](9683fda8-0d10-415b-9b3a-c273dc117ff7.png)

### **8. S&P 500 Annualized 10-Year Returns**
![Returns](0d6b4844-a4a3-4579-a70e-e52993de8a1c.png)

### **9. Market Valuations**
![Valuations](e38ecce7-3843-426e-944b-6c910b233c75.png)

---

### **Bobby Molavi**  
**Managing Director**  
**Global Banking & Markets | FICC & Equities**  
**Goldman Sachs International**  
**Published: January 15, 2025, 6:04 AM EST**
`;
  }

  getAiContentMock() {
    return `# Market Overview

- **Choppy Start to 2025**:  
  US markets, driven by major tech stocks (e.g., Nvidia), are **reversing gains** from early January.  
  Global equities have seen **selling pressure** for **three of the past four weeks**, largely driven by **increased short positioning**.

- **Inflation and Yields as Core Drivers**:  
  - **Non-farm payrolls** (+265k) surprised on the upside, driving **U.S. 10-year Treasury yields** near the **psychological 5% level**, pressuring equities.  
  - **UK 10-year bonds** reached levels **unseen since 2008**, alongside **notable GBP volatility**.

---

## **Asset Classes**

- **Bonds**:  
  - Rising **yields in the U.S. and UK** are creating **significant pressures** across asset classes.  
  - A **material breach of 5% on U.S. 10-year yields** could spark **further equity sell-offs**.

- **Commodities**:  
  - **Oil remains a strong performer YTD**, with **inflationary concerns** linked to **rebuilding efforts from natural disasters** like the **LA fires**.

- **Private Equity (PE)**:  
  - **PE AUM** has ballooned from **$1 trillion to $12 trillion**.  
  - However, **IPO markets remain constrained**.  
  - **PE activity** may grow in **M&A, spinoffs, and consolidations** if macroeconomic stability persists.

- **Venture Capital (VC)**:  
  - The **VC landscape is under pressure** from **prolonged holding periods** and **valuation declines**.  
  - **Capital calls in 2023 exceeded distributions by 80%**, with **fundraising times peaking at over 20 months**.

- **Equities**:  
  - **U.S. exceptionalism continues to dominate**, with **narrow market breadth** (5 stocks representing ~20% of global equity market cap).  
  - However, this **concentration increases momentum risks** and **vulnerability to corrections**.

---

## **Regional Focus**

- **MENA Region**:  
  - Expected to see **increased capital allocation, talent inflows, and issuance activity**.  
  - Further solidifying its role as a **growing financial ecosystem**.

- **UK**:  
  - Facing **structural challenges**, including **stagnation in growth**, **capital flight**, and **poor investor sentiment**.  
  - These issues are driven by **regulatory and political missteps**.
`;
  }
}

export const reportsDataService = new ReportsDataService();