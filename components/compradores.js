import React, {useState, useContext, useEffect} from 'react';
import {Keyboard, Modal, View} from 'react-native';
import {Button, Icon, Input, List, ListItem, Text} from '@ui-kitten/components';
import {StoreContext} from '../context/storeContext';

export const Compradores = () => {
  const {compradores, setCompradores} = useContext(StoreContext);
  const {agregarComprador} = useContext(StoreContext);
  const {modificarComprador} = useContext(StoreContext);
  const {eliminarComprador} = useContext(StoreContext);
  const [showModal, setShowModal] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(true);
  const [nuevoComprador, setNuevoComprador] = useState({
    id: null,
    nombre: null,
    email: null,
  });

  const renderItemIcon = (props) => <Icon {...props} name="person" />;
  const renderEditItemIcon = (props, item) => (
    <Icon
      {...props}
      name="edit-outline"
      onPress={() => {
        setNuevoComprador(item);
        setShowModal(true);
      }}
    />
  );
  const plusIcon = () => (
    <Icon style={{width: 26, height: 26}} fill="#FFFFFF" name="plus" />
  );

  useEffect(() => {
    if (!showModal) {
      setNuevoComprador(null);
    }
  }, [showModal]);

  const renderItem = ({item, index}) => {
    return (
      <ListItem
        title={`${item.nombre}`}
        description={`${item.email} `}
        accessoryLeft={renderItemIcon}
        accessoryRight={(props) => renderEditItemIcon(props, item)}
      />
    );
  };

  const RenderModal = () => {
    const [nombre, setNombre] = useState(nuevoComprador?.nombre || '');
    const [email, setEmail] = useState(nuevoComprador?.email || '');
    return (
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
          <View
            style={{
              flex: 1,
              marginTop: 80,
              backgroundColor: 'white',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              padding: 24,
            }}>
            <Text category="h3" style={{marginBottom: 20, textAlign: 'center'}}>
              {nuevoComprador
                ? 'Modificar comprador'
                : 'Agregar nuevo comprador'}
            </Text>
            <View style={{flex: 1}}>
              <Input
                label={'Nombre'}
                placeholder="Ingrese el nombre y apellido"
                size={'medium'}
                value={nombre}
                style={{marginBottom: 10}}
                onChangeText={(nombre) => setNombre(nombre)}
              />
              <Input
                label={'Email'}
                placeholder="Ingrese el email"
                size={'medium'}
                value={email}
                onChangeText={(email) => setEmail(email)}
              />
            </View>
            {nuevoComprador ? (
              <>
                <Button
                  appearance={'filled'}
                  status={'success'}
                  size={'large'}
                  onPress={() => {
                    modificarComprador({
                      id: nuevoComprador.id,
                      nombre: nombre,
                      email: email,
                    });
                    setShowModal(false);
                  }}>
                  Guardar cambios
                </Button>
                <Button
                  appearance={'outline'}
                  status={'danger'}
                  size={'large'}
                  style={{marginVertical: 14}}
                  onPress={() => {
                    eliminarComprador(nuevoComprador.id);
                    setShowModal(false);
                  }}>
                  Eliminar comprador
                </Button>
                <Button
                  appearance={'ghost'}
                  status={'danger'}
                  size={'large'}
                  onPress={() => {
                    setShowModal(false);
                  }}>
                  Cancelar
                </Button>
              </>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}>
                <Button
                  appearance={'outline'}
                  status={'danger'}
                  onPress={() => {
                    setShowModal(false);
                  }}>
                  Cancelar
                </Button>
                <Button
                  appearance={'filled'}
                  status={'success'}
                  disabled={!nombre && !email}
                  onPress={() => {
                    agregarComprador({nombre: nombre, email: email});
                    setShowModal(false);
                  }}>
                  Guardar
                </Button>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flex: 1}}>
      <RenderModal />
      <Button
        style={{
          position: 'absolute',
          right: 12,
          bottom: 12,
          zIndex: 10,
          elevation: 5,
          width: 48,
          height: 48,
          borderRadius: 24,
        }}
        appearance="filled"
        accessoryLeft={plusIcon}
        onPress={() => setShowModal(true)}
      />
      <List
        style={{flex: 1}}
        data={compradores}
        extraData={compradores}
        renderItem={renderItem}
      />
    </View>
  );
};
