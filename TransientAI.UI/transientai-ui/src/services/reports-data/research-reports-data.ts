'use server';

import { ResearchReport } from './model';

export async function getReports(): Promise<ResearchReport[]> {
  return [
    {
      name: 'GS: Ruminations - Macro, Micro, Markets',
      aiSummary: `# Market Overview

## Choppy Start to 2025
US markets, driven by major tech stocks (e.g., Nvidia), are reversing gains from early January. Global equities have seen selling pressure for three of the past four weeks, largely driven by increased short positioning.

## Inflation and Yields as Core Drivers 
Non-farm payrolls (+265k) surprised on the upside, driving U.S. 10-year Treasury yields near the psychological 5% level, pressuring equities. UK 10-year bonds reached levels unseen since 2008, alongside notable GBP volatility.

# Asset Classes

## Bonds
Rising yields in the U.S. and UK are creating significant pressures across asset classes. A material breach of 5% on U.S. 10-year yields could spark further equity sell-offs.

## Commodities
Oil remains a strong performer YTD, with inflationary concerns linked to rebuilding efforts from natural disasters like the LA fires.

## Private Equity (PE)
PE AUM has ballooned from $1 trillion to $12 trillion, but IPO markets remain constrained. PE activity may grow in M&A, spinoffs, and consolidations if macro stability persists.

## Venture Capital (VC)
The VC landscape is facing pressure from prolonged holding periods and valuation declines. Capital calls in 2023 exceeded distributions by 80%, with fundraising times peaking at over 20 months.

## Equities
U.S. exceptionalism continues to dominate, with narrow market breadth (5 stocks representing ~20% of global equity cap). However, concentration increases momentum risks and vulnerability to corrections.

# Regional Focus

## MENA Region
Expected to see increased capital allocation, talent inflows, and issuance activity, further solidifying its role as a growing financial ecosystem.

## UK
Facing structural challenges, including stagnation in growth, capital flight, and poor investor sentiment due to regulatory and political missteps.

## Europe
Struggling with intra-EU consolidation due to excessive regulation and limited GDP growth. Cross-border M&A and spin-offs are likely themes.

# Behavioral Trends
Increasing reliance on passive investing and systematic quant strategies has amplified momentum-driven markets. Retail investors favor high-performing stocks, such as Nvidia and MAG7 names, over value-driven plays.

Sentiment is shaped more by technical factors than fundamentals, with concentrated bets increasing market volatility and dislocations.

# Key Risks and Opportunities

## Risks
- Rising yields in U.S. and global bond markets
- Potential geopolitical and headline risks from a Trump 2.0 presidency
- Natural disasters and climate-related insurance liabilities (e.g., Florida's $500 billion property debt risk)

## Opportunities
- Increased M&A, driven by stable FX, corporate simplification, and AI-related investments
- Growth in private credit and infrastructure plays, leveraging longer durations and scale advantages
- Equity buybacks remain a significant driver of stock performance, particularly for concentrated market leaders

# Trade Ideas

## U.S. Treasuries (10-year)
- **Type**: Buy
- **Rationale**: If CPI shows signs of weakening inflation, bond yields could retrace below the critical 5% level
- **Trigger**: A softer-than-expected CPI reading or dovish Fed commentary

## Oil Futures
- **Type**: Buy
- **Rationale**: YTD strength in oil, coupled with inflation from natural disasters, supports further price appreciation
- **Trigger**: Sustained geopolitical tensions or disruptions in supply chains

## European Midcap Equities
- **Type**: Buy
- **Rationale**: Valuation gaps and cross-border M&A catalysts could provide upside
- **Trigger**: EU regulatory reforms or announced corporate consolidations

## U.S. Technology (Nvidia)
- **Type**: Sell
- **Rationale**: Nvidia's 10% decline highlights profit-taking risks in overbought growth stocks with high valuations
- **Trigger**: Breach of technical levels or additional short book growth

# Forward-Looking Commentary

## Macro Themes
Inflation/re-inflation, de-globalization, and deregulation will dominate 2025. Trump's policies could increase volatility and create headline risks for specific sectors.

## Asset Trends
De-equitization (private over public markets) and rising duration arbitrages in private credit/PE are structural shifts to monitor.

## Market Structure
Continued momentum and narrow index concentration pose risks if market sentiment shifts. Increasing participation from retail and systematic strategies could exacerbate volatility.
`,
      emailSource: `../emails/Ruminations.html`
    },
    {
      name: 'BNP Paribas Exane Research: INDIA STRATEGY - 2025 - the pricey paradise; cloudy skies',
      aiSummary: `# Summary of Research Report: BNP Paribas Exane Research – India Strategy 2025

## Market Overview

### Key Themes
- Indian equities remain expensive, with limited upside for broader markets due to less favorable global and local macroeconomic conditions
- Nifty 50 is projected to reach 25,500 by the end of 2025, indicating a potential 10% upside from current levels
- Mid and small caps appear overpriced, driven by strong domestic institutional flows despite economic headwinds
- Rising U.S. bond yields and USD strength are pressuring Indian equities through Foreign Institutional Investor (FII) outflows
- Local challenges include slowing GDP and earnings growth, constrained government stimulus capacity, and declining tax collections

## Asset Classes

### Equities
- Preference for large caps over mid and small caps due to better valuation metrics
- **Favorable sectors:**
  - Banks: Strong FY26 earnings growth outlook, minimal credit-cost risks, and below-median valuations
  - IT Services: Improved macro environment compared to the previous two years
  - Telecoms: Free cash flow (FCF) generation remains robust, supporting growth
  - Consumer Discretionary: Affluent consumption is favored over staples and mass-market segments like two-wheelers
- **Unfavorable sectors:**
  - Pharma: High valuations not supported by earnings growth potential
  - Metals: Weak steel demand and prices weigh on the outlook

### Bonds
- Rising U.S. yields negatively impact FII flows into emerging markets, including India

## Regional Focus

### India
- **Slowing domestic economic indicators:**
  - Earnings growth decline across sectors
  - Heat map of 50+ indicators signals bottoming out in Q3 2024, with recovery contingent on GDP and earnings growth

## Key Risks and Opportunities

### Risks
- Sustained FII outflows due to high U.S. yields and a strong dollar
- Limited fiscal flexibility for the government to support growth amid declining corporate tax and GST revenues
- Persistent high valuations in mid and small caps pose downside risks

### Opportunities
- Recovery in GDP and earnings growth could support market sentiment and valuations
- Large-cap sectors like Banks, IT, and Telecoms offer favorable risk-reward profiles

## Trade Ideas

### Equities
- **Banks**: Buy; Below-median valuations and robust FY26 earnings outlook. Monitor credit-cost trends and valuation metrics
- **IT Services**: Buy; Favorable macro conditions compared to the past two years. Initiate positions during market corrections
- **Telecoms**: Buy; Strong free cash flow and industry dynamics. Entry around dips driven by broader market weakness
- **Pharma**: Sell; High valuations relative to earnings growth prospects
- **Metals**: Sell; Weak steel demand and pricing remain headwinds

### Indices
- **Nifty 50**: Hold; Upside limited to 10% by end-2025. Reassess if economic growth surprises positively or global conditions improve

## Forward-Looking Commentary
- Global economic developments, including U.S. monetary policy and bond yield trends, are likely to dictate FII flows and market sentiment
- Local recovery in earnings and GDP growth, coupled with fiscal discipline, will be crucial for sustained market performance
- Continued sectoral divergence expected, with large caps outperforming broader markets`,
      emailSource: `../emails/India.html`
    },
    {
      name: 'GS Spec Sales: Feedback, Flows and Catalysts',
      aiSummary: `# Market Overview

## Macro Themes
- Nervousness surrounding UK retail persists due to employment concerns, higher cost-of-living impacts (notably food inflation), and operational cost pressures (e.g., wages)
- Chinese luxury demand shows early signs of stabilization, particularly in the jewellery segment, supported by Chinese New Year timing and strong US holiday season luxury spending

## Asset Classes

### Equities
- Mixed sentiment in UK retail:
  - Positive on Tesco for potential market share gains from UK food inflation
  - Cautious on other UK names like B&M
- Defensive interest in Chemicals: Selective names like DSFIR and BASF gaining traction due to tightening capacity utilization
- Renewed enthusiasm for aerospace (e.g., GSXECIVA) and electrification (GSXEACDC)

### Luxury
- Buying interest in Richemont (CFR) into Q3 trading update due to:
  - Improved Q4 sales outlook
  - US holiday demand
  - Resilient Chinese consumer spending
  - Favorable FX trends (weaker Yen aiding Japanese tourist spending)
- Short-selling activity in staples like IMB and CARLB, contrasting with positive flows in DGE and AD

### Healthcare
- **ArgenX (ARGX)**: Anticipated upside in Q4 Vyvgart sales due to early CIDP launch. Confidence in 2025 guidance driven by expected prescriber overlap with MG (70%)
- **AstraZeneca (AZN)**: Viewed as the top pick for its clinical catalysts and strong fundamentals, although Chinese policy risks are noted

### Commodities
- Positive outlook for Sunrise (SUNN) post-Q4 results with benefits from FX tailwinds, tariff resolution, and a seasonal activity bump post-Chinese New Year

### Telcos
- Sunrise vs. Swisscom: Sunrise offers high dividend yields and better market positioning (e.g., stable domestic business vs. Swisscom's declining local performance)

## Regional Focus
- **UK**: Increasing headwinds in retail due to food inflation and consumer sentiment, with a focus on Tesco as a market share winner
- **China**: Stabilization of high-frequency data, jewelry emerging as a resilient luxury category
- **Europe**: Renewed interest in defensive Chemicals and Aerospace, while Autos await clarity on tariffs

## Behavioral Trends
- High-frequency selling in luxury and mixed sentiment in semi-conductors (debate around ASML and BESI performance)
- Investors revisiting old themes like European defense and electrification due to positive early-year performance

## Key Risks and Opportunities

### Risks
- Heat pump competition pressures for NIBE, especially with German elections affecting incentives
- Regulatory concerns in gambling (e.g., Flutter) and healthcare (e.g., Novartis patent litigation)
- Autos exposed to potential tariff impacts

### Opportunities
- Chemicals sector tightening capacity signals selective upside in names like DSFIR and BASF
- Stabilization in Chinese luxury demand

## Trade Ideas

### Richemont (CFR)
- **Trade**: Buy CFR SE 21Feb25 148 Call for 3 CHF (32% delta, 140 CHF spot ref)
- **Rationale**: Positive Q3 trading update expected, supported by FX tailwinds and strong jewelry sales
- **Trigger**: Q3 trading update on January 16th

### NIBE
- **Trade**: Short NIBEB SS 21Mar25 37/28 Put Spread for 1.8 SEK (23% delta, 40.3 SEK spot ref)
- **Rationale**: Risks from heat pump competition and German policy changes
- **Trigger**: FY results on February 14th and German elections on February 23rd

### Sunrise (SUNN)
- **Trade**: Long SUNN into Q4 results, paired vs. Swisscom and VOD
- **Rationale**: Benefits from FX tailwinds, market share growth, and superior dividend yields
- **Trigger**: Q4 results on February 13th

### ArgenX (ARGX)
- **Trade**: Buy ARGX BB 21Feb25 680/760 Call Spread for 16 EUR (27% delta, 644 EUR spot ref)
- **Rationale**: Early phase success of CIDP launch with significant upside potential in Vyvgart sales
- **Trigger**: JPMorgan Healthcare Conference (January 13-16)

## Forward-Looking Commentary
- **Luxury**: Chinese jewelry demand remains a resilient category, likely to sustain momentum into Q1 despite tough comps
- **Chemicals**: Capacity utilization tightening signals medium-term opportunities in defensive segments
- **Healthcare**: AstraZeneca's strong catalyst profile positions it well for sustained interest, although Chinese risks need monitoring`,
      emailSource: `../emails/Feedback.html`
    }
  ];
}

export async function getEmailContentMock() {
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

export async function getAiContentMock() {
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
