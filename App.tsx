import React from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Realm from 'realm';
import { TextInput, Button, Divider, List, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';

// データIF
interface Hoge {
  prop1: number,
  prop2: string,
  prop3: boolean,
}

const style = StyleSheet.create({
  textInput: {
    padding: 12,
  },
  buttonStyle: {
    marginHorizontal: 12,
  },
  container: {
    // flex: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // width: '90%'
  },
  buttonContainer: {
    // flex: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '40%'
  },
  listItem: {
    backgroundColor: '#800000',
    borderRadius: 12,
    padding: 6,
    width: 245,
    color: '#FFFFFF'
  }
});

const fontConfig: any = {
  default: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
};


declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      myOwnColor: string;
    }

    interface Theme {
      myOwnProperty: boolean;
    }
  }
}

const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  // colors: {
  //   myOwnColor: '#ffffff',
  // },
  fonts: configureFonts(fontConfig),
};

const App = () => {
  const [text, setText] = React.useState('');
  const [allData, setAllData] = React.useState<Hoge[]>();


  // スキーマ名
  const HOGE_SCHEMA_NAME: string = 'Hoge';

  // スキーマ定義
  const HOGE_SCHEMA: Realm.ObjectSchema = {
    // スキーマ名
    name: HOGE_SCHEMA_NAME,
    // 主キー(省略可)
    primaryKey: 'prop1',
    // プロパティ
    properties: {
      // 型のみ指定
      prop1: 'int',
      // 型と初期値を指定
      prop2: { type: 'string', default: 'hoge' },
      prop3: { type: 'bool', default: false }
    }
  };

  React.useEffect(() => {
    Realm.open({ schema: [HOGE_SCHEMA] }).then((realm: Realm) => {
      // realm.deleteAll();
      setAllData(realm.objects(HOGE_SCHEMA_NAME).reduce((prev: Hoge[], current: any): Hoge[] => {
        prev.push({
          prop1: current['prop1'],
          prop2: current['prop2'],
          prop3: current['prop3'],
        });
        return prev;
      }, []));
    });
  }, []);

  const getID = () => {
    return Math.max.apply(null, allData !== undefined ? allData?.map(data => data.prop1) : [0]) + 1;
  };

  const addData = async () => {

    const printSystemName = () => {
      // OS 名を出力する
      const systemName = DeviceInfo.getSystemName();
      console.log(systemName);
    };
    printSystemName();
    console.log('Start addData');

    let realm: Realm;

    try {
      realm = await Realm.open({
        schema: [HOGE_SCHEMA],
      });

      realm.write(() => {
        realm.create(HOGE_SCHEMA_NAME,
          {
            prop1: getID(),
            prop2: text !== '' ? text : 'Hoge',
          });
      });

      setAllData(realm.objects(HOGE_SCHEMA_NAME).reduce((prev: Hoge[], current: any): Hoge[] => {
        prev.push({
          prop1: current['prop1'],
          prop2: current['prop2'],
          prop3: current['prop3'],
        });
        return prev;
      }, []));


      // console.log("App -> allData", allData);
    } catch (error) {
      console.log(error);
    } finally {
      // Realm データベースは使用後必ずクローズする
      // @ts-ignore
      if (realm !== undefined && !realm.isClosed) {
        setText('');
        realm.close();
      }
    }
  };


  const deleteData = async (index: number) => {
    const printSystemName = () => {
      // OS 名を出力する
      const systemName = DeviceInfo.getSystemName();
      console.log(systemName);
    };
    printSystemName();
    console.log('Start deleteData');

    let realm: Realm;


    try {
      realm = await Realm.open({
        schema: [HOGE_SCHEMA],
      });

      realm.write(() => {
        const deleteData = realm.objects(HOGE_SCHEMA_NAME).filtered(`prop1 = ${index}`)[0];
        realm.delete(deleteData);
      });

      setAllData(realm.objects(HOGE_SCHEMA_NAME).reduce((prev: Hoge[], current: any): Hoge[] => {
        prev.push({
          prop1: current['prop1'],
          prop2: current['prop2'],
          prop3: current['prop3'],
        });
        return prev;
      }, []));

      // console.log("App -> allData", allData);
    } catch (error) {
      console.log(error);
    } finally {
      // Realm データベースは使用後必ずクローズする
      // @ts-ignore
      if (realm !== undefined && !realm.isClosed) {
        realm.close();
      }
    }
  };

  const changeStatus = async (data: Hoge) => {
    const printSystemName = () => {
      // OS 名を出力する
      const systemName = DeviceInfo.getSystemName();
      console.log(systemName);
    };
    printSystemName();
    console.log('Start changeStatus');

    let realm: Realm;

    try {
      realm = await Realm.open({
        schema: [HOGE_SCHEMA],
      });

      realm.write(() => {
        // const changeData = realm.objects(HOGE_SCHEMA_NAME).filtered(`prop1 = ${data.prop1}`)[0];
        realm.create(HOGE_SCHEMA_NAME, { prop1: data.prop1, prop2: data.prop2, prop3: data.prop3 ? false : true }, true);
      });

      setAllData(realm.objects(HOGE_SCHEMA_NAME).reduce((prev: Hoge[], current: any): Hoge[] => {
        prev.push({
          prop1: current['prop1'],
          prop2: current['prop2'],
          prop3: current['prop3'],
        });
        return prev;
      }, []));


      // console.log("App -> allData", allData);
    } catch (error) {
      console.log(error);
    } finally {
      // Realm データベースは使用後必ずクローズする
      // @ts-ignore
      if (realm !== undefined && !realm.isClosed) {
        setText('');
        realm.close();
      }
    }
  };

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView>
        <TextInput
          label="Todo入力"
          value={text}
          onChangeText={setText}
          mode="outlined"
          autoFocus
          style={style.textInput}
        />
        <Button mode="contained" onPress={addData} style={style.buttonStyle}>
          登録
      </Button>
        <Divider />
        <List.Section >
          <List.Subheader>一覧</List.Subheader>
          {allData ? allData.map((data: Hoge, index: number) => {
            // return <View>
            return <View key={index + 1} style={style.container}>
              {/* <List.Item style={style.listItem} key={index + 1} title={`id: ${data.prop1} name: ${data.prop2}`} /> */}
              <List.Item title={`id: ${data.prop1} title: ${data.prop2}`} titleStyle={style.listItem} />
              <View style={style.buttonContainer}>
                <Button mode="outlined" onPress={() => changeStatus(data)}>{data.prop3 ? '完了' : '未'}</Button>
                <Button mode="outlined" onPress={() => deleteData(data.prop1)}>削除</Button>
              </View>
            </View>;
          }) : <Text>No data</Text>}
        </List.Section>
      </KeyboardAvoidingView>
      <SafeAreaView />
    </PaperProvider>
  );
};

export default App;