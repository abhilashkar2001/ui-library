export class AboutCard {
  static readonly overView = [
    {
      title: 'Card Overview',
      description:
        'The Emeralde Private Metal Credit Card is designed for discerning individuals who demand excellence in every aspect of their financial journey. Crafted from premium metal with a sophisticated design, this card offers unparalleled benefits and rewards.',
      cardInfo: [
        {
          title: 'Annual Fee',
          value: '₹0',
          description:
            'First year free, ₹5,000 from second year (waived on ₹2L+ annual spend)',
        },
        {
          title: 'Annual Fee',
          value: '₹0',
          description:
            'First year free, ₹5,000 from second year (waived on ₹2L+ annual spend)',
        },
        {
          title: 'Annual Fee',
          value: '₹0',
          description:
            'First year free, ₹5,000 from second year (waived on ₹2L+ annual spend)',
        },
        {
          title: 'Annual Fee',
          value: '₹0',
          description:
            'First year free, ₹5,000 from second year (waived on ₹2L+ annual spend)',
        },
      ],
      keyHighLights: [
        '1 Complimentary night stay with Epicure Plus Membership (validity of 1 year)',
        'Complimentary EazyDiner Prime Membership every year',
        '12,500 DTB Bank Reward Points as Joining Bonus and Annual Bonus',
        '2 EaseMyTrip Air Travel Vouchers worth ₹3,000 each on first ₹4,00,000 spends and next ₹4,00,000 spends',
      ],
    },
  ];
  static readonly benefits = [
    {
      title: 'Card Benefits',
      description:
        'Unlock premium rewards and exclusive privileges designed for your lifestyle. Experience unmatched value with every transaction.',
      cardInfo: [
        {
          title: 'Premium Rewards',
          description: 'Earn accelerated points on every purchase',
          cardPoints: [
            '5X points on dining, travel & entertainment',
            '3X points on online shopping and fuel',
            '1X points on all other transactions',
          ],
        },
        {
          title: 'Premium Rewards',
          description: 'Earn accelerated points on every purchase',
          cardPoints: [
            '5X points on dining, travel & entertainment',
            '3X points on online shopping and fuel',
            '1X points on all other transactions',
          ],
        },
        {
          title: 'Premium Rewards',
          description: 'Earn accelerated points on every purchase',
          cardPoints: [
            '5X points on dining, travel & entertainment',
            '3X points on online shopping and fuel',
            '1X points on all other transactions',
          ],
        },
        {
          title: 'Premium Rewards',
          description: 'Earn accelerated points on every purchase',
          cardPoints: [
            '5X points on dining, travel & entertainment',
            '3X points on online shopping and fuel',
            '1X points on all other transactions',
          ],
        },
      ],
    },
  ];
  static readonly features = [
    {
      title: 'Advanced Card Features',
      description:
        'Experience next-generation banking technology with premium features designed for the modern lifestyle.',
      bannerInfo: {
        title: 'Premium Metal Card',
        description:
          'Crafted from premium metal with cutting-edge technology embedded within.',
        types: [
          {
            title: 'Contactless Technology',
            description: 'Tap & pay anywhere',
          },
          {
            title: 'Contactless Technology',
            description: 'Tap & pay anywhere',
          },
          {
            title: 'Contactless Technology',
            description: 'Tap & pay anywhere',
          },
        ],
      },
      cardTitle: 'Digital Banking Excellence',
      cardInfo: [
        {
          title: 'AI-Powered Mobile App',
          description: `Intelligent spending insights, budget tracking, and personalized <br/> recommendations powered by machine learning.`,
          options: ['Smart Analytics', 'Voice Commands'],
        },
        {
          title: 'Biometric Authentication',
          description: `Multi-layer security with fingerprint, face recognition, and voice <br/> authentication for ultimate protection.`,
          options: ['Face ID', 'Touch ID'],
        },
        {
          title: 'Blockchain Integration',
          description: `Secure transaction ledger with blockchain technology ensuring transparency <br/> and immutable records.`,
          options: ['Immutable', 'Transparent'],
        },
      ],
    },
  ];
  static readonly FEE_CONFIG: any = {
    columns: [
      { key: 'type', header: 'Fee Type' },
      { key: 'amount', header: 'Amount' },
      { key: 'details', header: 'Details' },
    ],
  };

  static readonly FEES_AND_CHARGES_DATA = [
    {
      type: 'Annual Fee',
      amount: '₹0 (First Year)',
      details: '₹5,000 from 2nd year, waived on ₹2L+ spend',
    },
    {
      type: 'Cash Advance Fee',
      amount: '2.5%',
      details: 'Minimum ₹500 per transaction',
    },
    {
      type: 'Late Payment Fee',
      amount: 'Up to ₹1,300',
      details: 'Based on outstanding amount',
    },
    {
      type: 'Over Limit Fee',
      amount: '₹500',
      details: 'Per occurrence',
    },
    {
      type: 'Foreign Currency Markup',
      amount: '0%',
      details: 'No charges on international transactions',
    },
    {
      type: 'Interest Rate (APR)',
      amount: '3.5% per month',
      details: '42% per annum on outstanding balance',
    },
  ];
  static readonly CARD_DATA = {
    title: 'Fees & Charges',
    description: 'All fees and charges are subject to change without notice.',
  };
}
