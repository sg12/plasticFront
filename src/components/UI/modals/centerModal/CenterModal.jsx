import classes from './CenterModal.module.scss';

import PropTypes from 'prop-types';

const CenterModal = ({ children, visible, setVisible }) => {

	const rootClasses = [classes.centerModal];

	if (visible) {
		rootClasses.push(classes.active);
	}

	return (
		<div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
			<div className={classes.centerModalContent} onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>
	);
};

CenterModal.propTypes = {
	children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
	visible: PropTypes.any.isRequired,
	setVisible: PropTypes.any.isRequired,
};

export default CenterModal;