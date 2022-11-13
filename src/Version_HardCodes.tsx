/*Version Hardcodes:
Contains several hard-coded informations based on the
version-code provided by the API.
*/
const VERSION_HARDCODES: { [groupName: string]: VersionGroup } = {
	'red-blue': {
		order: 1,
		name: 'Red & Blue',
		abbr: 'RB',
		divStyle: '[background:linear-gradient(90deg,#c00000_50%,#0000c0_50%)]',
	},
	yellow: {
		name: 'Yellow',
		order: 2,
		abbr: 'Yellow',
		divStyle: 'bg-[#FECC34]',
	},
	'gold-silver': {
		name: 'Gold & Silver',
		order: 3,
		abbr: 'GS',
		divStyle: '[background:linear-gradient(90deg,#E2B624_50%,#C5D1CF_50%)]',
	},
	crystal: {
		name: 'Crystal',
		order: 4,
		abbr: 'Crystal',
		divStyle: 'bg-[#8798CB]',
	},
	'ruby-sapphire': {
		name: 'Ruby & Sapphire',
		order: 5,
		abbr: 'RS',
		divStyle: '[background:linear-gradient(90deg,#A81F02_50%,#215B8C_50%)]',
	},
	colosseum: {
		name: 'Colosseum',
		order: 6,
		abbr: 'Colosseum',
		divStyle: 'bg-[#EC1B24]',
	},
	'firered-leafgreen': {
		name: 'FireRed & LeafGreen',
		order: 7,
		abbr: 'FRLG',
		divStyle: '[background:linear-gradient(90deg,#DB3A11_50%,#3DB53D_50%)]',
	},
	emerald: {
		name: 'Emerald',
		order: 8,
		abbr: 'Emerald',
		divStyle: 'bg-[#01A956] order-6',
	},

	xd: {
		name: 'XD: Gale of Darkness',
		order: 9,
		abbr: 'XD',
		divStyle: 'bg-[#AE464E]',
	},
	'diamond-pearl': {
		name: 'Diamond & Pearl',
		order: 10,
		abbr: 'DP',
		divStyle: '[background:linear-gradient(90deg,#4CA4B6_50%,#B0758F_50%)]',
	},
	platinum: {
		name: 'Platinum',
		order: 11,
		abbr: 'Platinum',
		divStyle: 'order-11 bg-[#76597B]',
	},
	'heartgold-soulsilver': {
		name: 'HeartGold & SoulSilver',
		order: 12,
		abbr: 'HGSS',
		divStyle: '[background:linear-gradient(90deg,#AD7817_50%,#929292_50%)]',
	},
	'black-white': {
		name: 'Black & White',
		order: 13,
		abbr: 'B/W',
		divStyle: '[background:linear-gradient(90deg,black_50%,white_50%)]',
		textStyle: '[mix-blend-mode:exclusion] font-light',
	},
	'black-2-white-2': {
		name: 'Black & White 2',
		order: 14,
		abbr: 'B2/W2',
		divStyle: '[background:linear-gradient(270deg,black_50%,white_50%)]',
		textStyle: '[mix-blend-mode:exclusion] font-light',
	},
	'x-y': {
		name: 'X & Y',
		order: 15,
		abbr: 'XY',
		divStyle: '[background:linear-gradient(90deg,#0A5E9A_50%,#C92341_50%)]',
	},
	'omega-ruby-alpha-sapphire': {
		name: 'Omega Ruby & Alpha Sapphire',
		order: 16,
		abbr: 'ORAS',
		divStyle: '[background:linear-gradient(90deg,#E82625_50%,#0063AC_50%)]',
	},
	'sun-moon': {
		name: 'Sun & Moon',
		order: 17,
		abbr: 'SM',
		divStyle: '[background:linear-gradient(90deg,#F9991C_50%,#1993D0_50%)]',
	},
	'ultra-sun-ultra-moon': {
		name: 'Ultra Sun & Moon',
		order: 18,
		abbr: 'USUM',
		divStyle: '[background:linear-gradient(90deg,#AE5628_50%,#77458B_50%)]',
	},
	'lets-go-pikachu-lets-go-eevee': {
		name: "Let's Go Pikachu & Eevee",
		order: 19,
		abbr: 'LGPE',
		divStyle: '[background:linear-gradient(90deg,#E7B930_50%,#AA7848_50%)]',
	},
	'sword-shield': {
		name: 'Sword & Shield',
		order: 20,
		abbr: 'SwSh',
		divStyle: '[background:linear-gradient(90deg,#00A1E9_50%,#E70059_50%)]',
	},
};
export default VERSION_HARDCODES;

type VersionGroup = {
	order: number;
	name: string;
	abbr: string;
	divStyle: string;
	textStyle?: string;
};

// switch (version) {
//     case 'yellow':
//         buttonInfo = {
//             buttonClasses: 'bg-[#FECC34] order-2',
//             label: 'Yellow',
//         };
//         break;
//     case 'gold-silver':
//         buttonInfo = {
//             buttonClasses:
//                 '[background:linear-gradient(90deg,#E2B624_50%,#C5D1CF_50%)] order-3',
//             label: 'GS',
//         };
//         break;
//     case 'crystal':
//         buttonInfo = {
//             buttonClasses: 'order-4 bg-[#8798CB]',
//             label: 'Crystal',
//         };
//         break;
//     case 'ruby-sapphire':
//         buttonInfo = {
//             buttonClasses:
//                 '[background:linear-gradient(90deg,#A81F02_50%,#215B8C_50%)] order-5',
//             label: 'RS',
//         };
//         break;
//     case 'emerald':
//         buttonInfo = {
//             buttonClasses: 'bg-[#01A956] order-6',
//             label: 'Emerald',
//         };
//         break;
//     case 'firered-leafgreen':
//         buttonInfo = {
//             buttonClasses:
//                 '[background:linear-gradient(90deg,#DB3A11_50%,#3DB53D_50%)] order-7',
//             label: 'FRLG',
//         };
//         break;
//     case 'colosseum': {
//         buttonInfo = {
//             buttonClasses: 'order-8 bg-[#EC1B24]',
//             label: 'Colosseum',
//         };
//         break;
//     }
//     case 'xd':
//         buttonInfo = {
//             buttonClasses: 'order-9 bg-[#AE464E]',
//             label: 'XD',
//         };
//         break;
//     case 'diamond-pearl':
//         buttonInfo = {
//             buttonClasses:
//                 'order-10 [background:linear-gradient(90deg,#4CA4B6_50%,#B0758F_50%)]',
//             label: 'DP',
//         };
//         break;
//     case 'platinum':
//         buttonInfo = {
//             buttonClasses: 'order-11 bg-[#76597B]',
//             label: 'Platinum',
//         };
//         break;
//     case 'heartgold-soulsilver':
//         buttonInfo = {
//             buttonClasses:
//                 'order-12 [background:linear-gradient(90deg,#AD7817_50%,#929292_50%)]',
//             label: 'HGSS',
//         };
//         break;
//     case 'black-white':
//         buttonInfo = {
//             buttonClasses:
//                 'order-[13] [background:linear-gradient(90deg,black_50%,white_50%)]',
//             textClasses: '[mix-blend-mode:exclusion] font-light',
//             label: 'B/W',
//         };
//         break;
//     case 'black-2-white-2':
//         buttonInfo = {
//             buttonClasses:
//                 'order-[14] [background:linear-gradient(270deg,black_50%,white_50%)]',
//             textClasses: '[mix-blend-mode:exclusion] font-light',
//             label: 'B2/W2',
//         };
//         break;
//     case 'x-y':
//         buttonInfo = {
//             buttonClasses:
//                 'order-[15] [background:linear-gradient(90deg,#0A5E9A_50%,#C92341_50%)]',
//             label: 'XY',
//         };
//         break;
//     case 'omega-ruby-alpha-sapphire':
//         buttonInfo = {
//             buttonClasses:
//                 'order-[16] [background:linear-gradient(90deg,#E82625_50%,#0063AC_50%)]',
//             label: 'ORAS',
//         };
//         break;
//     case 'sun-moon':
//         buttonInfo = {
//             buttonClasses:
//                 'order-[17] [background:linear-gradient(90deg,#F9991C_50%,#1993D0_50%)]',
//             label: 'SM',
//         };
//         break;
//     case 'ultra-sun-ultra-moon':
//         buttonInfo = {
//             buttonClasses:
//                 'order-[18] [background:linear-gradient(90deg,#AE5628_50%,#77458B_50%)]',
//             label: 'USUM',
//         };
//         break;
//     case 'lets-go-pikachu-lets-go-eevee':
//         buttonInfo = {
//             buttonClasses:
//                 'order-[19] [background:linear-gradient(90deg,#E7B930_50%,#AA7848_50%)]',
//             label: 'LGPE',
//         };
//         break;
//     case 'sword-shield':
//         buttonInfo = {
//             buttonClasses:
//                 '[background:linear-gradient(90deg,#00A1E9_50%,#E70059_50%)] order-[20]',
//             label: 'SwSh',
//         };
//         break;
//     default:
//         buttonInfo = {
//             buttonClasses: 'order-last',
//             textClasses: 'text-black',
//             label: capitalize(version,'all','-',''),
//         };
//         break;
// }
