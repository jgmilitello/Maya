import type { CourseStep, QuizQuestion } from '@/src/components/CourseFlow'

export const stocksCourse: CourseStep[] = [
  {
    icon: '📈',
    title: 'What is a stock?',
    content: "When you buy a stock, you're buying a tiny piece of a company. If that company does well and grows, your piece becomes worth more. If it struggles, your piece is worth less. You literally become a part-owner of companies like Apple, Amazon, or whatever you invest in.",
    fun: "Owning 1 share of Apple literally makes you a part-owner of one of the world's most valuable companies.",
  },
  {
    icon: '🌱',
    title: 'Why do people buy stocks?',
    content: "To grow their money over time. Keeping cash in a savings account earns maybe 2-5% per year. Historically, the stock market has returned about 10% per year on average. That's the power of investing — your money grows faster than inflation steals it.",
    fun: "$10,000 invested in an S&P 500 index fund in 2010 would be worth over $60,000 today.",
  },
  {
    icon: '🧘',
    title: 'The right mentality',
    content: "Stocks go up AND down — sometimes dramatically. The key is NOT to panic and sell when they drop. You're not a day trader trying to time the market. You're building long-term wealth. Think years, not days. The biggest investing mistake people make is selling when they're scared.",
    fun: "Every single major market crash in history was followed by a full recovery and new all-time highs.",
  },
  {
    icon: '🧺',
    title: 'Diversification',
    content: "Don't put all your eggs in one basket. Spreading your money across different companies, industries, and even countries protects you. If one company goes bankrupt, it doesn't wipe out your whole portfolio. Index funds and ETFs are a simple way to instantly diversify.",
    fun: "An S&P 500 index fund owns a tiny piece of 500 of the largest US companies — instant diversification!",
  },
  {
    icon: '📖',
    title: 'Key terms you need to know',
    content: "Portfolio: your collection of investments. Dividend: cash a company pays you just for owning their stock. Market cap: total value of a company (share price × number of shares). Index fund: a fund that tracks a market index like the S&P 500. ETF: like an index fund but trades like a stock.",
    fun: "Many large companies like Coca-Cola and Johnson & Johnson have paid dividends every year for 50+ years.",
  },
  {
    icon: '🎉',
    title: "You're almost ready to invest!",
    content: "You now understand the basics of stocks — what they are, why people buy them, how to think about the ups and downs, and the importance of diversification. One quick quiz and your portfolio is waiting!",
    fun: "The best time to start investing was yesterday. The second best time is today. You're already here!",
  },
]

export const stocksQuiz: QuizQuestion[] = [
  {
    question: 'What does owning a stock actually mean?',
    options: [
      "You're lending money to a company",
      "You own a small piece of the company",
      "You're guaranteed to make money",
      'You can vote on all company decisions',
    ],
    correct: 1,
    explanation: "A stock represents partial ownership. When a company grows, your piece grows with it!",
  },
  {
    question: 'What has the US stock market historically returned per year on average?',
    options: ['2–3%', '5–6%', '~10%', '20–25%'],
    correct: 2,
    explanation: "The S&P 500 has returned ~10% annually on average — much better than a savings account.",
  },
  {
    question: 'What should you do when the market drops significantly?',
    options: [
      'Sell everything immediately',
      'Panic and move to cash',
      'Stay calm and resist selling',
      'Stop investing entirely',
    ],
    correct: 2,
    explanation: "Every market crash in history was followed by a full recovery. Panic-selling locks in your losses.",
  },
  {
    question: 'What is an index fund?',
    options: [
      'A single stock that tracks inflation',
      'A government savings account',
      'A type of high-risk bond',
      'A fund that tracks a market index like the S&P 500',
    ],
    correct: 3,
    explanation: "Index funds instantly diversify you across hundreds of companies with low fees — a beginner's best friend.",
  },
]

export const creditCardsCourse: CourseStep[] = [
  {
    icon: '💳',
    title: 'What is a credit card?',
    content: "A credit card lets you spend money you don't have yet — the bank pays for your purchase, and you pay the bank back later. If you pay it back in full by your due date, it costs you nothing extra. But if you don't pay in full, the bank charges you interest.",
    fun: "Credit cards are actually great tools if you use them right — they offer purchase protection, rewards, and help build your credit score.",
  },
  {
    icon: '👑',
    title: 'The golden rule',
    content: "ALWAYS pay your full statement balance every month. The minimum payment is a trap — it keeps you in debt for years and costs you hundreds or thousands in interest. Credit card interest rates are typically 20-30%, which is brutally expensive. Treat your credit card like a debit card: only spend what you can pay back.",
    fun: "If you only paid the minimum on a $5,000 credit card balance, it would take 16+ years to pay off and cost over $7,000 in interest.",
  },
  {
    icon: '📊',
    title: 'Credit utilization',
    content: "Credit utilization is how much of your available credit you're using. Using less than 30% of your limit is good. Using less than 10% is even better. This is one of the biggest factors in your credit score. Having a $5,000 limit and carrying a $500 balance = 10% utilization. Nice!",
    fun: "Keeping low utilization across all your cards is one of the fastest ways to boost your credit score.",
  },
  {
    icon: '💸',
    title: 'Interest rates (APR)',
    content: "APR (Annual Percentage Rate) is the interest rate you pay if you carry a balance. Credit card APR is typically 20-30% — that's extremely expensive debt. For comparison, mortgages are about 6-7%, and car loans are 5-10%. This is why carrying a balance is so damaging. Pay it off!",
    fun: "At 25% APR, $1,000 left unpaid for a year costs you $250 in interest — money you literally threw away.",
  },
  {
    icon: '⭐',
    title: 'Building your credit score',
    content: "Your credit score (300-850) is like a financial GPA that affects your ability to get loans, rent apartments, and even some jobs. Use your card for regular purchases, pay the full balance each month, and your score will rise over time. A score above 750 gets you the best interest rates on everything.",
    fun: "People with credit scores above 750 can save tens of thousands of dollars on a 30-year mortgage compared to someone with a 600 score.",
  },
  {
    icon: '🌟',
    title: "Almost done — quiz time!",
    content: "You now know how to use credit cards the smart way — pay in full every month, keep utilization low, and let your score grow. Answer 4 quick questions to prove it and unlock your dashboard!",
    fun: "Used correctly, credit card rewards are basically free money. Some people earn $1,000+ per year in cashback!",
  },
]

export const creditCardsQuiz: QuizQuestion[] = [
  {
    question: "What is the golden rule of credit cards?",
    options: [
      'Only use them for emergencies',
      'Pay the minimum balance each month',
      'Pay your full statement balance every month',
      'Never carry more than 1 card',
    ],
    correct: 2,
    explanation: "Paying in full every month means you pay zero interest — the bank literally pays YOU in rewards.",
  },
  {
    question: 'What credit utilization rate is best for your credit score?',
    options: ['Under 50%', 'Under 30%', 'Under 10%', 'It doesn\'t matter'],
    correct: 2,
    explanation: "Under 10% is ideal. Lenders see low utilization as a sign you manage credit responsibly.",
  },
  {
    question: 'What does APR stand for?',
    options: [
      'Annual Payment Rate',
      'Average Purchase Return',
      'Annual Percentage Rate',
      'Adjusted Principal Rate',
    ],
    correct: 2,
    explanation: "APR is the yearly interest rate charged on unpaid balances — typically 20–30% on credit cards.",
  },
  {
    question: 'What credit score range gets you the best loan rates?',
    options: ['500–600', '600–700', '700–750', '750 and above'],
    correct: 3,
    explanation: "Above 750 is considered excellent. It can save you tens of thousands on a mortgage!",
  },
]

export const bondsCourse: CourseStep[] = [
  {
    icon: '🏦',
    title: 'What is a bond?',
    content: "A bond is a loan you give to a company or government. They need money, you lend it to them, and they promise to pay you back with interest over time. At the end of the bond's term (the maturity date), they return your original money. You're literally being the bank.",
    fun: "When you buy a US Treasury bond, you're lending money to the US government — about the safest investment you can make.",
  },
  {
    icon: '🛡️',
    title: 'Why buy bonds?',
    content: "Bonds are safer and more predictable than stocks. Stocks can lose 50% of their value in a bad year — bonds rarely lose much. The tradeoff is lower returns. Bonds are great for balancing your portfolio, especially as you get older and want more stability.",
    fun: "A classic investment strategy: hold your age in bonds (so at 25, have 25% bonds, 75% stocks). More conservative as you age.",
  },
  {
    icon: '🗂️',
    title: 'Types of bonds',
    content: "Treasury bonds are issued by the US government — the safest option. Corporate bonds are from companies, offering higher interest rates but more risk. Municipal bonds ('munis') are from state/local governments and are often tax-free, making them great for high earners.",
    fun: "Municipal bond interest is often exempt from federal income tax — a hidden advantage for people in higher tax brackets.",
  },
  {
    icon: '📖',
    title: 'Key bond terms',
    content: "Face value (or par): the amount you'll get back when the bond matures, usually $1,000. Coupon rate: the interest rate the bond pays annually. Maturity date: when you get your money back. Yield: the actual return you get based on what you paid — if you buy a bond at a discount, your yield is higher than the coupon.",
    fun: "Bond prices and interest rates move in opposite directions — when rates go up, existing bond prices go down, and vice versa.",
  },
  {
    icon: '💎',
    title: "Almost there — quiz time!",
    content: "Bonds might seem boring, but they're a crucial part of a balanced portfolio. They provide steady income and protect against stock market crashes. Answer 4 questions to unlock your bond portfolio!",
    fun: "Warren Buffett's company Berkshire Hathaway holds billions in bonds as a safety cushion — even the greatest investor loves stability.",
  },
]

export const bondsQuiz: QuizQuestion[] = [
  {
    question: 'When you buy a bond, you are:',
    options: [
      'Buying ownership in a company',
      'Lending money to a company or government',
      'Getting a guaranteed stock market return',
      'Opening a special savings account',
    ],
    correct: 1,
    explanation: "Bonds are loans. You're the lender, and the company or government pays you interest for borrowing.",
  },
  {
    question: 'Compared to stocks, bonds typically offer:',
    options: [
      'Higher returns and higher risk',
      'Lower returns and lower risk',
      'Higher returns and lower risk',
      'The same risk and return',
    ],
    correct: 1,
    explanation: "Bonds are the stability layer of a portfolio — lower risk, lower reward, but predictable income.",
  },
  {
    question: "What is a bond's 'coupon rate'?",
    options: [
      'A discount you get when buying the bond',
      'The fee the broker charges',
      'The annual interest rate the bond pays',
      'The rate at which the bond matures',
    ],
    correct: 2,
    explanation: "The coupon rate is the fixed annual interest payment — like your return for lending the money.",
  },
  {
    question: 'When interest rates rise, bond prices generally:',
    options: ['Rise too', 'Stay the same', 'Fall', 'Double'],
    correct: 2,
    explanation: "Rates and bond prices move in opposite directions — a key concept for bond investing!",
  },
]

export const budgetingCourse: CourseStep[] = [
  {
    icon: '🗺️',
    title: 'What is budgeting?',
    content: "Budgeting is simply knowing where your money goes. It's NOT about restricting yourself or being cheap — it's about being intentional. When you budget, you're choosing how to spend your money rather than wondering where it all went at the end of the month.",
    fun: "People who budget report feeling less stressed about money, even if their income stays the same. Knowledge = power.",
  },
  {
    icon: '✂️',
    title: 'The 50/30/20 rule',
    content: "A simple framework: spend 50% on needs (rent, groceries, bills), 30% on wants (dining out, shopping, entertainment), and 20% on savings and debt payoff. You don't have to follow it perfectly — it's a helpful starting point to see if your spending is balanced.",
    fun: "The 20% savings rate doesn't mean investing in stocks. It includes emergency fund, paying down debt, and any retirement contributions.",
  },
  {
    icon: '🔍',
    title: 'Track everything',
    content: "You can't manage what you don't measure. Most people dramatically underestimate how much they spend on dining out, shopping, and subscriptions. Connecting your accounts gives you the full picture. Once you can see it, you can make better decisions.",
    fun: "Studies show people who track their spending save an average of $500 more per month than those who don't.",
  },
  {
    icon: '📂',
    title: 'Categories are your friend',
    content: "Credit card companies already categorize every purchase you make: groceries, gas, dining, travel, shopping, etc. Mayas uses these same categories to automatically organize your spending so you don't have to. You'll see instantly which categories are eating your budget.",
    fun: "The average American spends over $3,000 per year on dining out alone — do you know how much you spend?",
  },
  {
    icon: '📅',
    title: 'Review monthly',
    content: "At the end of each month, spend 10 minutes looking at where your money went. Were you surprised by any category? Adjust your budget for next month. Financial awareness is a skill that gets easier and more natural over time.",
    fun: "Monthly reviews take about 10 minutes but can save you hundreds. That's $600 per hour of your time!",
  },
  {
    icon: '✨',
    title: "One quick quiz and you're in!",
    content: "You've got the mindset and the framework. Prove it with 4 questions and unlock your budget dashboard. You're about to feel so much more in control of your finances!",
    fun: "Budgeting isn't a diet for your money — it's more like a GPS. You're still in charge of the destination.",
  },
]

export const budgetingQuiz: QuizQuestion[] = [
  {
    question: "In the 50/30/20 rule, what does the 20% represent?",
    options: [
      'Dining and entertainment',
      'Housing and rent',
      'Clothing and shopping',
      'Savings and debt payoff',
    ],
    correct: 3,
    explanation: "The 20% covers your emergency fund, debt repayment, and investing — the most important slice!",
  },
  {
    question: 'What is the real purpose of budgeting?',
    options: [
      'Restricting yourself from spending',
      'Saving every possible dollar',
      'Being intentional about where your money goes',
      'Avoiding all debt forever',
    ],
    correct: 2,
    explanation: "Budgeting is about awareness and intention — not deprivation. You choose where your money goes.",
  },
  {
    question: 'How much more do people who track spending save per month on average?',
    options: ['$50 more', '$200 more', '$500 more', '$1,000 more'],
    correct: 2,
    explanation: "Studies show $500/month more — just from the awareness that tracking creates. Knowledge is power!",
  },
  {
    question: 'How often should you review your budget?',
    options: ['Only when you overspend', 'Once a year', 'Every day', 'Monthly'],
    correct: 3,
    explanation: "A monthly 10-minute review lets you spot patterns and adjust — it's the habit that makes it work.",
  },
]
