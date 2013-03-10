set names utf8;
use cadc2013;
create user 'cadc2013'@'localhost' identified by 'cadc2013/wky';

create table accounts (
    `aid` int not null auto_increment,
    `login` varchar(45) not null unique,
    `passwd` varchar(45) not null,
    `time` datetime not null,
    `grp_id` int,
    foreign key (`grp_id`) references groups(gid)
    primary key (`aid`)
)
ENGINE=MyISAM DEFAULT CHARSET=utf8 comment='注册用户';

create table entrants (
    `eid` int not null auto_increment,
    `stu_id` varchar(45) not null unique,
    `name` varchar(45) not null,
    `gender` varchar(45) not null,
    `school` varchar(45) not null,
    `phone` varchar(45) not null,
    `email` varchar(45) not null,
    `teacher` varchar(45) not null,
    primary key (`eid`, `stu_id`)
)
ENGINE=MyISAM DEFAULT CHARSET=utf8 comment='参赛人';


create table groups (
    `gid` int not null auto_increment,
    `leader` int not null unique,
    `type` varchar(45) not null,
    `title` varchar(45) not null,
    `represent` varchar(45),
    `member1` int,
    `member2` int,
    `ref` int,
    `extra` varchar(255) not null;
    foreign key (`leader`) references entrants(`eid`),
    foreign key (`member1`) references entrants(`eid`),
    foreign key (`member2`) references entrants(`eid`),
    primary key (`gid`)
)
ENGINE=MyISAM DEFAULT CHARSET=utf8 comment='参赛团队';
