import React, {Component} from 'react';
import {
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Linking,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';

import {colors} from '../wizerCore';

class News extends Component {
  constructor() {
    super();
    this.state = {
      articles: [],
      country: '',
      lat: null,
      long: null,
      refreshing: false,
      newsError: null,
    };
  }

  extensionIcon = () => {
    const icons = {
      icon: require('./icon.png'),
    };
    return icons.icon;
  };

  getArticles = async () => {
    try {
      let articles = await fetch(
        'https://newsapi.org/v2/everything?q=sport&language=en&sortBy=publishedAt&apiKey=3ebaa723ec0946adadddac496601ef69',
      );
      let result = await articles.json();
      let articlesArray = [];
      for (let i = 0; i < 10; i++) {
        const article = result.articles[i];
        if (article !== undefined) {
          const description = article.description;
          const newDes = description.replace(/(<([^>]+)>)/gi, '');
          article.description = newDes;
          articlesArray.push(article);
        }
      }
      this.setState({articles: articlesArray, newsError: null});
    } catch (error) {
      console.log('error', error);
      this.setState({newsError: "We couldn't load the news"});
    }
  };

  componentDidMount() {
    this.getArticles();
  }

  renderViewLess = onPress => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Text>View less</Text>
      </TouchableOpacity>
    );
  };
  renderViewMore = onPress => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Text>View More</Text>
      </TouchableOpacity>
    );
  };

  onRefresh = async () => {
    this.setState({refreshing: true});
    await this.getArticles();
    this.setState({refreshing: false});
  };

  render() {
    const {articles, newsError} = this.state;
    return newsError !== null ? (
      <View style={styles.hideStatusBar}>
        <Text style={styles.loadingText}>{newsError}</Text>
      </View>
    ) : articles.length === 0 ? (
      <View style={styles.loadingView}>
        <Text style={styles.loadingText}>Loading latest news</Text>
        <ActivityIndicator size="large" color="#44234C" />
      </View>
    ) : (
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={this.onRefresh}
            refreshing={this.state.refreshing}
            colors={[colors.wizer]}
            tintColor="#44234C"
          />
        }>
        <Text style={styles.newsHeader}>The latest sport-headlines</Text>
        {articles.map((item, i) => {
          let itemDateFormat = null;
          if (item.publishedAt === null) {
            itemDateFormat = 'not available';
          } else {
            const articleDate = new Date(item.publishedAt);
            let dd = articleDate.getDate();
            let mm = articleDate.getMonth() + 1;
            const yyyy = articleDate.getFullYear();
            if (dd < 10) {
              dd = '0' + dd;
            }
            if (mm < 10) {
              mm = '0' + mm;
            }
            let hh = articleDate.getHours();
            let minmin = articleDate.getMinutes();
            if (hh < 10) {
              hh = '0' + hh;
            }
            if (minmin < 10) {
              minmin = '0' + minmin;
            }
            const itemTime = hh + ':' + minmin;
            const itemDate = dd + '/' + mm + '/' + yyyy;
            itemDateFormat = itemDate + ' - ' + itemTime;
          }

          let articleAuthor = '';
          if (item.author === null) {
            articleAuthor = 'not available';
          } else {
            articleAuthor = JSON.stringify(item.author);
            articleAuthor = articleAuthor.substring(
              1,
              articleAuthor.length - 1,
            );
            if (articleAuthor.length > 16) {
              articleAuthor = articleAuthor.substr(0, 14) + '...';
            }
          }
          return (
            <View
              key={i}
              style={
                i === articles.length - 1
                  ? styles.newsItem
                  : [styles.newsItem, styles.newsItemBorder]
              }>
              <Image style={styles.itemImg} source={{uri: item.urlToImage}} />
              <View style={styles.itemImgFlex}>
                <Text style={styles.itemImgText}>{itemDateFormat}</Text>
                <Text style={styles.itemImgText}>Source({articleAuthor})</Text>
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemText}>{item.description}</Text>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(item.url);
                }}
                style={styles.itemButton}>
                <Text style={styles.itemButtonText}>Read full article</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  hideStatusBar: {
    // flex: 1,
  },
  newsHeader: {
    color: colors.wizer,
    marginVertical: 10,
    fontSize: 20,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
  },
  loadingView: {
    flex: 1,
  },
  loadingText: {
    fontSize: 25,
    color: colors.wizer,
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    marginBottom: 75,
    marginTop: 50,
  },
  newsItem: {
    marginBottom: 20,
    display: 'flex',
    paddingBottom: 20,
  },
  newsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.wizer,
  },
  itemImg: {
    height: 150,
    width: '100%',
    resizeMode: 'cover',
  },
  itemImgFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemImgText: {
    fontSize: 15,
    color: colors.wizer,
    marginVertical: 5,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-italic' : 'Didot-italic',
  },
  itemText: {
    color: colors.wizer,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  itemTitle: {
    color: colors.wizer,
    marginTop: 5,
    marginBottom: 10,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
    fontSize: 17,
  },
  itemButton: {
    borderWidth: 1,
    borderColor: colors.wizer,
    borderRadius: 5,
    width: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 15,
  },
  itemButtonText: {
    fontSize: 15,
    alignSelf: 'center',
    color: colors.wizer,
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
});

export default News;
