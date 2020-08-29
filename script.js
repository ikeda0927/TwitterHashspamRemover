
function getTrends(trendSection){
  let trends = [];
  let elements = trendSection.getElementsByTagName('div');
  for(let i=0;i<elements.length;i++){
    if(elements[i].getAttribute('data-testid')=='trend'){
      // console.log(elements[i].getElementsByClassName('link-complex-target txt-ellipsis')[0].textContent);
      trends.push(elements[i].getElementsByClassName('link-complex-target txt-ellipsis')[0].textContent);
    }
  }
  return trends;
}

function getArticles(tweetSection){
  // let articles = [];
  let articles = tweetSection.getElementsByTagName('article');
  // for(let i=0;i<elements.length;i++){
  //   articles.push(elements[i].getElementsByClassName('js-tweet-text tweet-text with-linebreaks')[0].textContent);
  // }
  return articles;
}

function check(articles,trends){
  const NUM = 5;
  let regs = [];
  for(let r=0;r<trends.length;r++){
    regs.push(new RegExp(trends[r].replace('#','')));
  }
  for(let i = 0;i<articles.length;i++){
    if(articles[i].getElementsByClassName('hashspamRemover').length==0){
      let div = document.createElement('div');
      div.className='hashspamRemover';
      articles[i].appendChild(div);
      let tweet = articles[i].getElementsByClassName('js-tweet-text tweet-text with-linebreaks')[0].textContent;
      let hashtags=[];
      let aTags = articles[i].getElementsByTagName('a');
      for(let a=0;a<aTags.length;a++){
        try{
          hashtags.push(aTags[a].getElementsByTagName('span')[1].textContent);
        }catch(e){
        }
      }
      if(hashtags.length>=4){
        hashtags.shift();
        hashtags.pop();
        hashtags.pop();
        hashtags.pop();
      }
      let counter = 0;
      for(let j=0;j<regs.length;j++){
        if(regs[j].test(tweet)){
          counter++;
        }else{
          for(let h=0;h<hashtags.length;h++){
            if(regs[j].test(hashtags[h])){
              counter++;
              break;
            }
          }
        }
        if(counter>NUM-1){
          console.log(tweet);
          articles[i].remove();
          break;
        }
      }
    }
  }
}

while(true){
  let sections = document.querySelector("#container > div").children;
  let trendNum=1;
  let homeNum=0;
  for(let i=0;i<sections.length;i++){
    try{
      if(sections[i].getElementsByClassName("column-heading")[0].textContent=="Trending"){
        trendNum=i;
        break;
      }else if(sections[i].getElementsByClassName("column-heading")[0].textContent=="Home"){
        homeNum=i;
      }
    }catch(e){
      //console.log(e);
    }
  }
  for(let i=0;i<sections.length;i++){
    let trends = getTrends(sections[trendNum]);
    if(i!=trendNum || i!=homeNum){
      let articles = getArticles(i);
      check(articles,trends);
    }
  }
}
