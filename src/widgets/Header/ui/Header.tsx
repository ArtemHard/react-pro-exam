import { useState } from 'react';
import classNames from 'classnames';
import s from './Header.module.css';
import { Logo } from '../../../shared/ui/Logo';
import { Search } from '../../../features/search';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../shared/store/utils';
import { userActions, userSelectors } from '../../../shared/store/slices/user';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { FavoritesBadge } from './FavoritesBadge';
import { CartBadge } from './CartBadge';

export const Header = () => {
	const accessToken = useAppSelector(userSelectors.getAccessToken);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const closeLogoutModal = () => {
		setIsLogoutModalOpen(false);
	};

	const handleLogout = () => {
		closeLogoutModal();
		dispatch(userActions.clearUser());
		navigate('/');
	};

	return (
		<header className={s.header}>
			<div className={classNames('container', s.header__wrapper)}>
				<Logo />
				<Search />
				<div className={s['header__icons-menu']}>
					<FavoritesBadge />
					<CartBadge />
					{accessToken && (
						<>
							<Link className={s['header__icons-menu-item']} to='/profile'>
								<svg
									viewBox='64 64 896 896'
									focusable='false'
									data-icon='user'
									width='1em'
									height='1em'
									fill='currentColor'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'>
									<path d='M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z'></path>
								</svg>
							</Link>
							<button
								type='button'
								className={classNames(
									s['header__icons-menu-item'],
									s['header__logout-button']
								)}
								onClick={() => setIsLogoutModalOpen(true)}>
								Выйти
							</button>
						</>
					)}
				</div>
			</div>
			<Modal
				isOpen={isLogoutModalOpen}
				onClose={closeLogoutModal}
				title='Выход из аккаунта'>
				<p className={s['header__logout-text']}>
					Вы уверены, что хотите выйти из аккаунта?
				</p>
				<div className={s['header__logout-actions']}>
					<Button variant='secondary' onClick={closeLogoutModal}>
						Отмена
					</Button>
					<Button onClick={handleLogout}>Выйти</Button>
				</div>
			</Modal>
		</header>
	);
};
