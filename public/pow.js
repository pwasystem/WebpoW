if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');

//if(navigator.onLine){
	firebase.initializeApp(firebaseConfig);
	var A=firebase.auth();
	var B=firebase.firestore();
	B.enablePersistence();
	firebase.analytics();
//}

var inicio=true;
var user=null;
window.onload=()=>{
	A.onAuthStateChanged(u=>{
		user=u?u:null;
		Menu();
		if(inicio)Inicio();
		inicio=false;
	})
}

function Inicio(){
	if(user){			
		switch (Hash(user.photoURL)) {
			case 'super-usuario':
				Load('#admin');
		}
	}else{
		Load('#inicio');
	}
}

function Menu(){
	R('arquivos','acessos.menu;array-contains;'+(user?user.displayName:publico),'filtro').then(a=>{
		c='';
		for(b in a)c+="<a class='w3-bar-item w3-button' onclick=\"Load('"+a[b].hash+"')\">"+(a[b].nome=='Login'&&user?'Logoff':a[b].nome)+"</a>";
		$('#menu').innerHTML=c;
	});
}

function _(funcao,parametros){
	funcao(parametros);
}

function $(Obj){
	return document.querySelector(Obj);
}

function Forms(){
	a=document.forms;
	for(b in a)a[b].onsubmit=Send.bind(a[b]);
}

function Send(event){
	Post(event.target);
    event.preventDefault();
}

function Main(a){
	$('#main').innerHTML=a;
	Forms();
}

function JS(js,sid='debug'){
	if(b=document.getElementById(sid)){b.remove();}
	head = document.getElementsByTagName("head")[0],
	script = document.createElement("script");
	head.insertBefore(script,head.lastChild);
	script.id = sid;
	script.src = "data:text/javascript;base64,"+btoa(unescape(encodeURIComponent(js)));
	return true;
}

function Load(a){
	location.hash=a;
	Main("<br><div class='w3-center'><img src='load.gif' alt='load' width='50' height='50'></div>");
	R('arquivos/'+a).then(b=>{
		if(b!='permission-denied'){
			JS(b.sistema,b.hash);
			setTimeout(Main,50,b.fonte);
		}else{
			Main("<h3 class='w3-container w3-center w3-yellow'>404 - Arquivo não localizado</h3>");
		}
	}).catch(e=>{
		console.log(e);
		Aviso('Erro','falha ao carregar a página','red');
	})
}

function Ajax(u,c){
	var h=new XMLHttpRequest();
	h.onreadystatechange=function(){
		if(this.readyState==4){
			if(this.status==200&&c)_(c,unescape(h.responseText));
			if(this.status==404)_(c,'404');
		};
	};
	h.open('GET',(u+''+(u.match("\\?")?'&':'?')+'random='+Math.random()),true);
	h.send();
}

function Debug(a){
	Ajax('debug/'+a+'.js',JS);
	setTimeout(Ajax,100,'debug/'+a+'.html',Main);
}

function Aviso(a,b,c){
	$('#avisoTitulo').innerHTML=a;
	$('#avisoMensagem').innerHTML=b;
	$('#avisoCor').className='w3-container'+c?' w3-'+c:'';
	E('#aviso');
}

function E(x){
	$(x).className.indexOf("w3-show")==-1?$(x).className+=" w3-show":$(x).className=$(x).className.replace(" w3-show","");
}

function R(ra,rw,ro,rl){
	try{
		return B.doc(ra).get().then(rb=>{
			return rb.data();
		}).catch(re=>{
			return re.code;
		});
	}catch{
		re=B.collection(ra);
		if(rw){
			rq=rw.split('|');
			wt=rq.length;
			for(i=0;i<wt;i++){
				rf=rq[i].split(';');
				rf[2]=rf[2].indexOf('*')<0?rf[2]:rf[2].substr(1).split(',');
				re=re.where(rf[0],rf[1],rf[2]);
			}
		}
		if(ro){
			rf=ro.split(',');
			re=re.orderBy(rf[0],rf[1]);
		}
		if(rl){
			re=re.limit(rl);
		}
		return re.get().then(rc=>{
			rb=new Array;
			rc.forEach((rd)=>{rb[rd.id]=rd.data();})
			return rb;
		}).catch(e=>{
			return e.code;
		});		
	}
}

function Hash(a){
	return a.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w\s]/gi,'').replace(/\s/g,'-').replace(/--/g,'-').toLowerCase();
}