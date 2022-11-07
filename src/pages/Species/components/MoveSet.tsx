import { useEffect, useState, useMemo } from 'react';
import { capitalize } from '../../../utils';
import { Spinner, getFromDB } from '../../../db';
import TypeIcons from '../../../components/TypeIcons';
const MoveSet = ({ moves }: any) => {
	const [formatted, setFormatted] = useState<'loading' | any>('loading');
	const [selected, setSelected] = useState<string>('sword-shield');
	useEffect(() => {
		setFormatted('loading');
		organizeVersionGroups(moves).then(x => {
			if (!x[selected]) {
				setSelected(Object.keys(x)[0]);
			}
			setFormatted(x);
		});
	}, [moves]);
	const vMoves = useMemo(() => {
		let r = {
			total: 0,
			levelUp: [] as any[],
			machine: [] as any[],
			tutor: [] as any[],
		};
		if (formatted == 'loading') return r;
		(formatted?.[selected] || []).forEach((f: any) => {
			r.total += 1;
			switch (f.method) {
				case 'level-up':
					r.levelUp.push(f);
					break;
				case 'machine':
					r.machine.push(f);
					break;
				case 'tutor':
					r.tutor.push(f);
					break;
			}
		});
		return { ...r, levelUp: r.levelUp.sort((x, y) => x.level - y.level) };
	}, [formatted, selected]);

	return (
		<div className="h-full mx-20 border border-black grow">
			<h4 className="text-xl font-medium text-center"> Learnset </h4>
			{(formatted == 'loading' && <Spinner />) || (
				<>
					<div className="flex flex-wrap gap-2 p-2 justify-evenly">
						{Object.keys(formatted).map((item, index) => (
							<VersionButton
								key={index}
								version={item}
								onClick={() => setSelected(item)}
								className={
									selected == item
										? 'drop-shadow-xl scale-125 '
										: ''
								}
							></VersionButton>
						))}
					</div>
					<div className="flex flex-wrap h-full">
						{/*LEARNSET TABLE*/}

						<MoveTable
							title="Level-Up"
							moves={vMoves.levelUp}
							include_learned
						/>
						<MoveTable title="Machine" moves={vMoves.machine} />
						<MoveTable title="Move Tutor" moves={vMoves.tutor} />
					</div>

					{vMoves.total < 1 && (
						<p className="w-full text-center text-red-700 bg-gray-800/20">
							{' '}
							No Moves Found{' '}
						</p>
					)}
				</>
			)}
		</div>
	);
};
export default MoveSet;
const MoveTable = (props: any) => {
	return (
		<table className="border-t border-black w-min-1/3 w-fit grow">
			<thead className="border-black border-y font-medium text-center">
				<tr className="w-full">
					<td className="font-medium text-center">{props.title}</td>
				</tr>
				<tr
					className={`grid ${
						props.include_learned
							? 'grid-cols-[2fr_6em_6em_6em_6em_6em]'
							: 'grid-cols-[2fr_6em_6em_6em_6em]'
					}`}
				>
					<td>Name</td>
					{props?.include_learned && <td>Learned</td>}
					<td>Class</td>
					<td>Type</td>
					<td>Power</td>
					<td>Accuracy</td>
				</tr>
			</thead>
			<tbody>
				{props.moves.map((item: any, index: number) => (
					<tr
						key={index}
						className={`odd:bg-black/10 grid ${
							props.include_learned
								? 'grid-cols-[2fr_6em_6em_6em_6em_6em]'
								: 'grid-cols-[2fr_6em_6em_6em_6em]'
						}`}
					>
						<td className="odd:bg-blue-800/10">
							{capitalize(item.name.split('-').join(' '))}
						</td>
						{props?.include_learned && <td> Level {item.level}</td>}
						<td>{item.class}</td>
						<td className="my-auto">
							<TypeIcons typing={[item]} />
						</td>
						<td>{item.power}</td>
						<td>{item.acc ? `${item.acc}%` : ''}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
const VersionButton = ({ version, className, onClick }: any) => {
	/* Great Big Button Switch.  Style "Version Buttons" depending on the version string.  Default to a simple white button on the end for any not in the switch */
	let buttonInfo: {
		buttonClasses: string;
		label: string;
		textClasses?: string;
	};
	switch (version) {
		case 'red-blue':
			buttonInfo = {
				buttonClasses:
					'[background:linear-gradient(90deg,#A81F02_50%,#215B8C_50%)] order-1',
				label: 'RB',
			};
			break;
		case 'yellow':
			buttonInfo = {
				buttonClasses: 'bg-[#FECC34] order-2',
				label: 'Yellow',
			};
			break;
		case 'gold-silver':
			buttonInfo = {
				buttonClasses:
					'[background:linear-gradient(90deg,#E2B624_50%,#C5D1CF_50%)] order-3',
				label: 'GS',
			};
			break;
		case 'crystal':
			buttonInfo = {
				buttonClasses: 'order-4 bg-[#8798CB]',
				label: 'Crystal',
			};
			break;
		case 'ruby-sapphire':
			buttonInfo = {
				buttonClasses:
					'[background:linear-gradient(90deg,#A81F02_50%,#215B8C_50%)] order-5',
				label: 'RS',
			};
			break;
		case 'emerald':
			buttonInfo = {
				buttonClasses: 'bg-[#01A956] order-6',
				label: 'Emerald',
			};
			break;
		case 'firered-leafgreen':
			buttonInfo = {
				buttonClasses:
					'[background:linear-gradient(90deg,#DB3A11_50%,#3DB53D_50%)] order-7',
				label: 'FRLG',
			};
			break;
		case 'colosseum': {
			buttonInfo = {
				buttonClasses: 'order-8 bg-[#EC1B24]',
				label: 'Colosseum',
			};
			break;
		}
		case 'xd':
			buttonInfo = {
				buttonClasses: 'order-9 bg-[#AE464E]',
				label: 'XD',
			};
			break;
		case 'diamond-pearl':
			buttonInfo = {
				buttonClasses:
					'order-10 [background:linear-gradient(90deg,#4CA4B6_50%,#B0758F_50%)]',
				label: 'DP',
			};
			break;
		case 'platinum':
			buttonInfo = {
				buttonClasses: 'order-11 bg-[#76597B]',
				label: 'Platinum',
			};
			break;
		case 'heartgold-soulsilver':
			buttonInfo = {
				buttonClasses:
					'order-12 [background:linear-gradient(90deg,#AD7817_50%,#929292_50%)]',
				label: 'HGSS',
			};
			break;
		case 'black-white':
			buttonInfo = {
				buttonClasses:
					'order-[13] [background:linear-gradient(90deg,black_50%,white_50%)]',
				textClasses: '[mix-blend-mode:exclusion] font-light',
				label: 'B/W',
			};
			break;
		case 'black-2-white-2':
			buttonInfo = {
				buttonClasses:
					'order-[14] [background:linear-gradient(270deg,black_50%,white_50%)]',
				textClasses: '[mix-blend-mode:exclusion] font-light',
				label: 'B2/W2',
			};
			break;
		case 'x-y':
			buttonInfo = {
				buttonClasses:
					'order-[15] [background:linear-gradient(90deg,#0A5E9A_50%,#C92341_50%)]',
				label: 'XY',
			};
			break;
		case 'omega-ruby-alpha-sapphire':
			buttonInfo = {
				buttonClasses:
					'order-[16] [background:linear-gradient(90deg,#E82625_50%,#0063AC_50%)]',
				label: 'ORAS',
			};
			break;
		case 'sun-moon':
			buttonInfo = {
				buttonClasses:
					'order-[17] [background:linear-gradient(90deg,#F9991C_50%,#1993D0_50%)]',
				label: 'SM',
			};
			break;
		case 'ultra-sun-ultra-moon':
			buttonInfo = {
				buttonClasses:
					'order-[18] [background:linear-gradient(90deg,#AE5628_50%,#77458B_50%)]',
				label: 'USUM',
			};
			break;
		case 'lets-go-pikachu-lets-go-eevee':
			buttonInfo = {
				buttonClasses:
					'order-[19] [background:linear-gradient(90deg,#E7B930_50%,#AA7848_50%)]',
				label: 'LGPE',
			};
			break;
		case 'sword-shield':
			buttonInfo = {
				buttonClasses:
					'[background:linear-gradient(90deg,#00A1E9_50%,#E70059_50%)] order-[20]',
				label: 'SwSh',
			};
			break;
		default:
			buttonInfo = {
				buttonClasses: 'order-last',
				textClasses: 'text-black',
				label: capitalize(version.split('-').join(' ')),
			};
			break;
	}
	return (
		<button
			className={
				className +
				' border px-2 rounded-full relative transition-transform ' +
				buttonInfo.buttonClasses
			}
			onClick={onClick}
		>
			<span className={'text-white ' + buttonInfo?.textClasses}>
				{buttonInfo.label}{' '}
			</span>
		</button>
	);
};
const organizeVersionGroups = async (moves: any[]) => {
	let organized: any = {};
	for (let i = 0; i < moves.length; i++) {
		let moveName = moves[i].move.name;
		let moveData = await getFromDB(
			`https://pokeapi.co/api/v2/move/${moveName}`
		);
		moves[i].version_group_details.forEach((vg: any) => {
			let info = {
				name: moveName,
				type: moveData.type,
				method: vg.move_learn_method.name,
				level: vg.level_learned_at,
				class: capitalize(moveData.damage_class.name),
				acc: moveData.accuracy,
				power: moveData.power,
			};
			if (organized?.[vg.version_group.name])
				organized[vg.version_group.name].push(info);
			else organized[vg.version_group.name] = [info];
		});
	}
	return organized;
};
