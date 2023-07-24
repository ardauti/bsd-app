import {colors} from "../../utils";
import React, {useEffect, useMemo, useState} from "react";
import {Chart} from "../index";
import PropTypes from "prop-types";


function Main(props) {
    const progressData = props.data.progress;
    const chartData = progressData.map(progress => Object.values(progress)[0]);

    const chartColors = [
        colors.secondary(0.9),
        colors.warning(0.9),
        colors.danger(0.9),
        colors.success(0.9),
    ];

    const data = useMemo(() => {
        return {
            labels: ["Backlog", "In Progress", "Review", "Completed"],
            datasets: [
                {
                    data: chartData,
                    backgroundColor: chartColors,
                    hoverBackgroundColor: chartColors,
                    borderWidth: 5,
                    borderColor: colors.white,
                },
            ],
        };
    }, [chartColors, chartData]);

    const options = useMemo(() => {
        return {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            cutout: "80%",
        };
    });

    return (
        <Chart
            type="doughnut"
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
    data: PropTypes.any
};

Main.defaultProps = {
    width: "auto",
    height: "auto",
    className: "",
};


export default Main;
