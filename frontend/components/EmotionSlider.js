import styled from 'styled-components';
import { useFormikContext } from 'formik';

const SliderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
`;

const EmotionName = styled.input`
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    flex: 1;
    margin-right: 20px;
`;

const EmotionValue = styled.input`
    flex: 2;
`;

function EmotionSlider({ index }) {
    const { values, setFieldValue } = useFormikContext();

    return (
        <SliderWrapper>
            <EmotionName
                type="text"
                value={values.emotions[index].name}
                onChange={(e) => {
                    const newEmotions = [...values.emotions];
                    newEmotions[index].name = e.target.value;
                    setFieldValue('emotions', newEmotions);
                }}
            />
            <EmotionValue
                type="range"
                min="0"
                max="100"
                value={values.emotions[index].value}
                onChange={(e) => {
                    const newEmotions = [...values.emotions];
                    newEmotions[index].value = Number(e.target.value);
                    setFieldValue('emotions', newEmotions);
                }}
            />
            <span>{values.emotions[index].value}</span>
        </SliderWrapper>
    );
}

export default EmotionSlider;
