import React from 'react';
import { Link } from 'react-router-dom';


export default function HeaderUsers(props) {
  const { user, allMessages } = props;

  const hasUnread = allMessages.filter(message => message.isRead === false);


  const checkRole = (selectedRoles) => {
    const currentRoles = user?.userRoles?.map(role => role.name);

    return selectedRoles.some((role) => currentRoles?.includes(role));
  }


  const checkStatus = (selectedStatus) => {
    console.log(user.userStatus)
    const currentStatus = user?.userStatus?.map(status => status.type);
    console.log(currentStatus)
    return selectedStatus.some((status) => currentStatus?.includes(status));
  }

  return (
    <header className='headerUsers'>
      <div className='headerUsers__icons'>
        {
          checkRole(['administrator']) || checkStatus(['Committee']) ?
            <Link to='espace-membre/messages'>
              {hasUnread.length > 0 ?
                <i data-count={hasUnread.length} className="fa-solid fa-envelope link unread"></i>
                :
                <i className="fa-solid fa-envelope link"></i>
              }
            </Link>
            :
            null
        }
      </div>
      <h2 className='headerUsers__title'>Bienvenue {user.firstName} {user.lastName}</h2>
    </header>
  )
}