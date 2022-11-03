import { MdOutlineArrowLeft } from 'react-icons/md';
export const ArrowButton = ({
	onClick,
	className,
}: {
	onClick?: () => void;
	className?: string;
}) => {
	return (
		<div
			className={`relative rounded-full overflow-hidden h-8 w-8 border-2 box-content border-black z-10 hover:cursor-pointer group ${className}`}
			onClick={onClick}
		>
			<div className="transition-colors bg-red-500 group-hover:bg-blue-400 group-active:bg-purple-600 h-1/2" />
			<MdOutlineArrowLeft className="absolute top-0 left-0 w-full h-full text-slate-900" />
			<div className="bg-white h-1/2" />
		</div>
	);
};
