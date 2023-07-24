

import {useRecoilValue} from "recoil";
import {colors} from "../../utils";
import {useMemo} from "react";
import {Chart} from "../index";
import PropTypes from "prop-types";

function Main(props) {
    const darkMode = useRecoilValue(darkModeStore);
    const colorScheme = useRecoilValue(colorSchemeStore);

    const chartData = [15, 10, 65];
    const chartColors = () => [
        colors.pending(0.9),
        colors.warning(0.9),
        colors.primary(0.9),
    ];
    const data = useMemo(() => {
        return {
            labels: ["Yellow", "Dark"],
            datasets: [
                {
                    data: chartData,
                    backgroundColor: colorScheme ? chartColors() : "",
                    hoverBackgroundColor: colorScheme ? chartColors() : "",
                    borderWidth: 5,
                    borderColor: darkMode ? colors.darkmode[700]() : colors.white,
                },
            ],
        };
    });

    const options = useMemo(() => {
        return {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
        };
    });

    return (
        <Chart
            type="pie"
            width={props.width}
            height={props.height}
            data={data}
            options={options}
            className={props.className}
        />
    );
}

Main.propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
};

Main.defaultProps = {
    width: "auto",
    height: "auto",
    className: "",
};

export default Main;
