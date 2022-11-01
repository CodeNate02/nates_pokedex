import {MdOutlineArrowLeft} from 'react-icons/md'
export const ArrowButton = ({
	onClick,
	className,
}: {
	onClick?: () => void;
	className?: string;
}) => {
	return (
		<div
			className={`relative rounded-full overflow-hidden h-8 w-8 border-2 box-content border-black ${className}`}
			onClick={onClick}
		>
			<div className="h-1/2 bg-red-500" />
			<MdOutlineArrowLeft className="h-full w-full absolute top-0 left-0 text-slate-900" />
			<div className="h-1/2 bg-white" />
		</div>
	);
};
