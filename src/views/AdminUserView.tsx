import React, { useState, useEffect, useContext } from 'react';
import firebase from '../firebase';
import { HospitalForUI, User, UserForUI } from '../types';
import { Redirect } from 'react-router';
import Select from 'react-select';
import { FirebaseAuthContext } from '../providers/FirebaseAuth';

type Option = { value: string; label: string };

type HospitalsState = {
  loading: boolean;
  loaded: boolean;
  hospitals: HospitalForUI[] | null;
};

type UsersState = {
  loading: boolean;
  loaded: boolean;
  users: UserForUI[];
};

type UserState = {
  loading: boolean;
  user: User | null;
};

export default function AdminUsersView(): JSX.Element {
  const userState: UserState = useContext(FirebaseAuthContext);

  const [hospitalsState, setHospitalsState] = useState<HospitalsState>({
    loading: false,
    loaded: false,
    hospitals: null,
  });
  const [usersState, setUsersState] = useState<UsersState>({
    loading: false,
    loaded: false,
    users: [],
  });

  let usersRef: firebase.database.Reference | null = null;
  let hospitalsRef: firebase.database.Reference | null = null;

  useEffect(() => {
    // If the user is signed in and an admin, load a list of all users and all hospitals
    //  we will have permission to do so.
    // If not, we won't have permission, so don't bother. There will be a redirect as soon as render() gets called
    //  anyway.
    if (userState.user?.isAdmin) {
      // Load users to populate the table rows and track a ref to unsubscribe later
      usersRef = firebase.database().ref('users');
      usersRef.on('value', (usersRef) => {
        const usersVal: any = usersRef.val();

        // Map the default Firebase object with ids used as keys to a more traditional array with id values
        const users: UserForUI[] = Object.keys(usersVal).map((key) => {
          return {
            ...usersVal[key],
            id: key,
          };
        });

        setUsersState({ ...usersState, users, loading: false, loaded: true });
      });

      // Load the hospitals for the "editorOf" dropdowns and track a ref to unsubscribe later
      hospitalsRef = firebase.database().ref('hospitals');
      hospitalsRef.on('value', (ref) => {
        const val: any = ref.val();

        // Map the default Firebase object with ids used as keys to a more traditional array with id values
        let hospitals: HospitalForUI[] | null = null;
        if (val) {
          hospitals = Object.keys(val).map((key) => {
            return {
              id: key,
              ...val[key],
            };
          }) as HospitalForUI[];
        }

        setHospitalsState({ loading: false, loaded: true, hospitals });
      });
    }

    return (): void => {
      if (usersRef) usersRef.off();
      if (hospitalsRef) hospitalsRef.off();
    };
  }, [userState]);

  const isLoading = (): boolean => usersState.loading || userState.loading || hospitalsState.loading;
  const isAdmin = (): boolean => !!userState.user?.isAdmin;

  const getHospitalSelectOptions = (): Option[] =>
    ((hospitalsState && hospitalsState.hospitals) || []).map((hospital) => {
      return {
        value: hospital.id,
        label: hospital.name,
      };
    });

  const getHospital = (hospitalId: string): Option =>
    getHospitalSelectOptions().filter((hospital) => hospital.value === hospitalId)[0];

  const onSelectHospital = (userId: string) => (selection: any): void => {
    firebase.database().ref(`users/${userId}`).update({
      editorOf: selection.value,
    });
  };

  const onIsAdminChange = (userId: string) => (event: any): void => {
    firebase.database().ref(`users/${userId}`).update({
      isAdmin: event.target.checked,
    });
  };

  return (
    <>
      {isLoading() && <p>Loading...</p>}
      {!isLoading() && (
        <>
          {!isAdmin() && <Redirect to="/" />}
          {isAdmin() && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Is Admin</th>
                  <th>Editor Of</th>
                </tr>
              </thead>
              <tbody>
                {usersState.users &&
                  usersState.users.length > 0 &&
                  usersState.users.map((rowUser) => (
                    <tr key={rowUser.id}>
                      <td>{rowUser.id}</td>
                      <td>{rowUser.email}</td>
                      <td>
                        <label>
                          <input
                            type="checkbox"
                            checked={rowUser.isAdmin}
                            onChange={onIsAdminChange(rowUser.id)}
                            disabled={rowUser.id === ((userState.user as unknown) as UserForUI).id}
                          />
                        </label>
                      </td>
                      <td>
                        {rowUser.id};{((userState.user as unknown) as UserForUI).id}
                      </td>
                      <td style={{ width: '300px' }}>
                        <Select
                          value={getHospital(rowUser.editorOf)}
                          onChange={onSelectHospital(rowUser.id)}
                          options={getHospitalSelectOptions() as any}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  );
}
