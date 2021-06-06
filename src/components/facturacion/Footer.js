import { Card } from 'primereact/card';

export const Footer = ({content}) => {
    return (
    <Card className="p-d-flex" style={{position: "fixed", bottom:"0", width:"100%"}}>
        <p>
            {content}
        </p>
    </Card>);
};