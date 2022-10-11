import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const ProgressLine = ({
    label,
    // expected format for visual parts
    visualParts = [
        {
            percentage: "0%",
            color: "white"
        }
    ]
}) => {
    // Starting values needed for the animation
    // Mapped by "visualParts" so it can work with multiple values dynamically
    // It's an array of percentage widths
    const [widths, setWidths] = useState(
        visualParts.map(() => {
            return 0;
        })
    );

    useEffect(() => {
        // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
        // You need to wrap it to trigger the animation
        requestAnimationFrame(() => {
            // Set a new array of percentage widths based on the props
            setWidths(
                visualParts.map(item => {
                    return item.percentage;
                })
            );
        });
    }, [visualParts]);

    return (
        <>
            <div className="progressVisualFull">
                {visualParts.map((item, index) => {
                    // map each part into separate div and each will be animated
                    // because of the "transition: width 2s;" css in class "progressVisualPart"
                    // and because of the new width ("widths[index]", previous one was 0)
                    return (
                        <Box
                            key={index}
                            style={{
                                width: widths[index],
                                backgroundColor: item.color,
                                borderRadius: "25px"
                            }}
                            className="progressVisualPart"
                        ></Box>
                    );
                })}
            </div>
        </>
    );
};

export default ProgressLine;
