import React from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Realm from 'realm';
import { TextInput, Button, Divider, List, configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';

// データIF
interface Hoge {
  prop1: number,
  prop2: string,
}

const style = StyleSheet.create({
  container: {
    // flex: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%'
  },
  listItem: {
    backgroundColor: '#800000',
    borderRadius: 12,
    padding: 6,
    width: 260,
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
    }
  };

  React.useEffect(() => {
    Realm.open({ schema: [HOGE_SCHEMA] }).then((realm: Realm) => {
      setAllData(realm.objects(HOGE_SCHEMA_NAME).reduce((prev: Hoge[], current: any): Hoge[] => {
        prev.push({
          prop1: current['prop1'],
          prop2: current['prop2']
        });
        return prev;
      }, []));
    });
  }, []);

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
            prop1: realm.objects(HOGE_SCHEMA_NAME).length + 1,
            prop2: text
          });
      });

      setAllData(realm.objects(HOGE_SCHEMA_NAME).reduce((prev: Hoge[], current: any): Hoge[] => {
        prev.push({
          prop1: current['prop1'],
          prop2: current['prop2']
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
    console.log("deleteData -> index", index);
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
          prop2: current['prop2']
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

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView>
        <TextInput
          label="TestProperty"
          value={text}
          onChangeText={setText}
          mode="outlined"
          autoFocus
        />
        <Button mode="contained" onPress={addData}>
          登録
      </Button>
        <Divider />
        <List.Section >
          <List.Subheader>リスト</List.Subheader>
          {allData ? allData.map((data, index) => {
            // return <View>
            return <View style={style.container} key={index + 1} >
              {/* <List.Item style={style.listItem} key={index + 1} title={`id: ${data.prop1} name: ${data.prop2}`} /> */}
              <List.Item title={`id: ${data.prop1} name: ${data.prop2}`} titleStyle={style.listItem} />
              <Button mode="outlined" onPress={() => deleteData(data.prop1)}>削除</Button>
            </View>;
          }) : <Text>No data</Text>}
        </List.Section>
      </KeyboardAvoidingView>
      <SafeAreaView />
    </PaperProvider>
  );
};

export default App;