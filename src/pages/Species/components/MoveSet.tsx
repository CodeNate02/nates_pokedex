import { useEffect, useState, useMemo } from 'react';
import { capitalize } from '../../../utils';
import { Spinner, getFromDB } from '../../../db';
import TypeIcons from '../../../components/TypeIcons';
import V from '../../../Version_HardCodes';
import { useNavigate } from 'react-router';
import { icon_physical, icon_special, icon_status } from '../../../assets';
var calcing = 0;
const MoveSet = ({ moves }: any) => {
	const [formatted, setFormatted] = useState<'loading' | any>('loading');
	const [selected, setSelected] = useState<string>('sword-shield');
	useEffect(() => {
		setFormatted('loading');
		//Calcing checks number of currently promised calculations
		calcing += 1;
		let id = calcing;
		organizeVersionGroups(moves).then(x => {
			if (id == calcing) {
				//If this task is the newest promise, it's the one we want to set.
				if (!x[selected]) {
					setSelected(Object.keys(x)[0]);
				}
				setFormatted(x);
				calcing = 0; //Once it's set, calcing can be set back to 0.
			}
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
										: 'hover:scale-105'
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
	const nav = useNavigate();
	return (
		<table className="border-t border-black w-min-1/3 w-fit grow">
			<thead className="border-black border-y font-medium">
				<tr className="w-full">
					<td className="font-semibold text-center">{props.title}</td>
				</tr>
				<tr
					className={`grid text-center ${
						props.include_learned
							? 'grid-cols-[2fr_6em_6em_6em_3em_4.5em]'
							: 'grid-cols-[2fr_6em_6em_3em_4.5em]'
					}`}
				>
					<td className='text-right pr-8'>Name</td>
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
						className={`odd:bg-black/10 grid text-center relative origin-bottom-left hover:scale-105 hover:cursor-pointer hover:bg-blue-50 ${
							props.include_learned
								? 'grid-cols-[2fr_6em_6em_6em_3em_4.5em]'
								: 'grid-cols-[2fr_6em_6em_3em_4.5em]'
						}`}
						onClick={() =>
							nav(
								`/move/${item.name
									.toLowerCase()
									.replace(' ', '-')}`
							)
						}
					>
						<td className="odd:bg-blue-800/10 pr-2 text-right">
							{capitalize(item.name, 'all', '-', ' ')}
						</td>
						{props?.include_learned && (
							<td > Level {item.level}</td>
						)}
						<td className="bg-blue-400/10 bg-no-repeat bg-contain bg-center font-medium" style={{
						backgroundImage: `url(${
							item.class == 'physical'
								? icon_physical
								: item.class == 'special'
								? icon_special
								: icon_status
						})`,
					}}>{capitalize(item.class,'first')}</td>
						<td className="my-auto text-center">
							<TypeIcons typing={[item]} />
						</td>
						<td className="bg-blue-400/10">{item.power}</td>
						<td className="">
							{item.acc ? `${item.acc}%` : ''}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
const VersionButton = ({ version, className, onClick }: any) => {
	/* Great Big Button Switch.  Style "Version Buttons" depending on the version string.  Default to a simple white button on the end for any not in the switch */
	return (
		<button
			type="button"
			className={`
				${V?.[version]?.divStyle} ${className}
				border px-2 rounded-full relative transition-transform
			`}
			style={{
				order: `${V?.[version]?.order || 'last'}`,
			}}
			onClick={onClick}
		>
			<span
				className={
					V?.[version]
						? `${V[version].textStyle} text-white`
						: 'text-black'
				}
			>
				{V?.[version]?.abbr || capitalize(version, 'all', '-', '')}{' '}
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
				class: moveData.damage_class.name,
				acc: moveData.accuracy,
				power: moveData.power,
			};
			moveData.past_values.forEach((pastValue: any) => {
				//Modify move information depending on the version group name
				if (V[pastValue.version_group.name].order > V[vg.version_group.name].order)
					info = {
						...info,
						...{
							acc: (pastValue.accuracy ? pastValue.accuracy : moveData.accuracy),
							type: (pastValue.type ? pastValue.type : moveData.type),
							power: (pastValue.power ? pastValue.power : moveData.power),
						},
					};
				}
			);
			/*Undo the Physical/Special Split in games before DP*/
			if(V[vg.version_group.name].order<10 && moveData.damage_class.name != 'status'){
				switch(info.type.name){
					case 'fire':
					case 'water':
					case 'grass':
					case 'electric':
					case 'psychic':
					case 'ice':
					case 'dragon':
					case 'dark':
						info.class='special'
						break;
					case 'normal':
					case 'fighting':
					case 'flying':
					case 'poison':
					case 'ground':
					case 'rock':
					case 'bug':
					case 'ghost':
					case 'steel':
						info.class='physical'
						break;
				}
			}
			/*Switch Water Suriken to physical in gen 6*/
			if(info.name =='water-shuriken' && V[vg.version_group.name].order<17){
				info.class='physical'
			}
			if (organized?.[vg.version_group.name])
				organized[vg.version_group.name].push(info);
			else organized[vg.version_group.name] = [info];
		});
	}
	return organized;
};
