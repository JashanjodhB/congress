
type Props = {
  x: number;
  y: number;
  member: {
    name: string;
    imageURL: string;
    Party: string;
    [key: string]: any;
  };
  onClick: () => void;
};

const Member = ({ x, y, member, onClick }: Props) => {
  return (
    <g transform={`translate(${x}, ${y})`} onClick={onClick} style={{ cursor: "pointer" }}>
      <text
        textAnchor="middle"
        y={-20}
        style={{ fontSize: 8, fontFamily: "sans-serif", pointerEvents: "none" }}
      >
        {member.name}
      </text>
      <image
        href={member.imageURL}
        width={20}
        height={20}
        x={-10}
        y={-10}
        style={{ borderRadius: "50%" }}
      />
    </g>
  );
};

export default Member;
