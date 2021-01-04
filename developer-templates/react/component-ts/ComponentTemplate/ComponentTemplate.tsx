import React, {FunctionComponent} from 'react';
import styles from "./ComponentTemplate.module.css";

type ComponentTemplateProps = {
    id: string,
    name: string
};

/***
 * ComponentTemplate component.
 * @param id -
 * @param name -
 * returns a ComponentTemplate with :TODO
 */

const ComponentTemplate: FunctionComponent<ComponentTemplateProps> = ({id, name}) => {
    return (<div>
    </div>);
};

export default ComponentTemplate;