import {useState} from 'react';
import PropTypes from 'prop-types';

const Tabs = ({children}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className='tabs'>
      <div className='tab-titles'>
        {children.map((child, index) =>
          child.type.displayName === 'TabTitle' ? (
            <div
              key={index}
              className={`tab-title ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleTabClick(index)}>
              {child.props.children}
            </div>
          ) : null
        )}
      </div>
      <div className='tab-contents'>
        {children.map((child, index) =>
          child.type.displayName === 'TabContent' && index === activeIndex ? (
            <div key={index} className='tab-content'>
              {child.props.children}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

const TabTitle = ({children}) => children;
TabTitle.displayName = 'TabTitle';

const TabContent = ({children}) => children;
TabContent.displayName = 'TabContent';

Tabs.Title = TabTitle;
Tabs.Content = TabContent;
Tabs.propTypes = {
  children: PropTypes.node.isRequired
};

export default Tabs;
