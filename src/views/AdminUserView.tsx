import React, { useState, useEffect, useContext } from 'react';
import firebase from '../firebase';
import { HospitalForUI, User, UserForUI, Hospital } from '../types';
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
  users: UserForUI[] | null;
};

type UserState = {
  loading: boolean;
  loaded: boolean;
  user: User | null;
};

export default function AdminUsersView(): JSX.Element {
  const { firebaseAuthUser, user } = useContext(FirebaseAuthContext);
  const [hospitalsState, setHospitalsState] = useState<HospitalsState>({
    loading: false,
    loaded: false,
    hospitals: null,
  });
  const [usersState, setUsersState] = useState<UsersState>({
    loading: false,
    loaded: false,
    users: null,
  });

  let userRef: firebase.database.Reference | null = null;
  let usersRef: firebase.database.Reference | null = null;
  let hospitalsRef: firebase.database.Reference | null = null;

  useEffect(() => {
    if (firebaseAuthUser && firebaseAuthUser.uid && user) {
      userRef = firebase.database().ref(`users/${firebaseAuthUser.uid}`);

      userRef.update({
        lastSignedIn: new Date(),
      });

      if (user.isAdmin) {
        usersRef = firebase.database().ref('users');

        usersRef.on('value', (usersRef) => {
          const usersVal: any = usersRef.val();

          const users: UserForUI[] = Object.keys(usersVal).map((key) => {
            return {
              ...usersVal[key],
              id: key,
            };
          });

          setUsersState({ ...usersState, users, loading: false, loaded: true });
        });
      }

      hospitalsRef = firebase.database().ref('hospitals');

      hospitalsRef.on('value', (ref) => {
        const val: any = ref.val();

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
      if (userRef) userRef.off();
      if (hospitalsRef) hospitalsRef.off();
    };
  }, [user]);

  const isLoading = (): boolean => usersState.loading || hospitalsState.loading;
  const isAdmin = (): boolean | null => user?.isAdmin || false;

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
                  usersState.users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>
                        <label>
                          <input
                            type="checkbox"
                            checked={user.isAdmin}
                            onChange={onIsAdminChange(user.id)}
                            disabled={user.id === ((user as unknown) as UserForUI).id}
                          />
                        </label>
                      </td>
                      <td style={{ width: '300px' }}>
                        <Select
                          value={getHospital(user.editorOf)}
                          onChange={onSelectHospital(user.id)}
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
